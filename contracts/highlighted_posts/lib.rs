#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

pub use highlighted_posts::{
    HighlightedPostsError, HighlightedPostsRef, DELETE_HIGHLIGHT_SELECTOR,
    HIGHLIGHT_POST_SELECTOR,
};

#[ink::contract]
mod highlighted_posts {
    use ink_lang::{codegen::EmitEvent, utils::initialize_contract};
    use ink_storage::{traits::SpreadAllocate, Mapping};

    // Selectors are short byte arrays that uniquely identify the entrypoints of
    // the contract. We need them to construct the `CallBuilder` instance.
    // They can be found by expanding the `#[ink::contract]` macro.

    pub const HIGHLIGHT_POST_SELECTOR: [u8; 4] =
        [0x4B_u8, 0x05_u8, 0x0E_u8, 0xA9_u8];

    pub const DELETE_HIGHLIGHT_SELECTOR: [u8; 4] =
        [0xEB_u8, 0x34_u8, 0xEF_u8, 0x93_u8];

    type Event =
        <HighlightedPosts as ink_lang::reflect::ContractEventBase>::Type;

    #[ink(event)]
    pub struct PostHighlighted {
        author: AccountId,
        id: u32,
    }

    #[ink(event)]
    pub struct HighlightRemoved {
        author: AccountId,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum HighlightedPostsError {
        AlreadyHighlighted,
        HighlightNotFound,
        AccessDenied,
    }

    /// Set of highlighted posts. One per author.
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct HighlightedPosts {
        created_by: AccountId,
        highlighted: Mapping<AccountId, u32>,
    }

    impl HighlightedPosts {
        /// Constructor that initializes the contract with empty map.
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            initialize_contract(|instance: &mut HighlightedPosts| {
                instance.created_by = caller;
            })
        }

        /// Adds the post to the highlighted set.
        #[ink(message, payable)]
        pub fn add(
            &mut self,
            author: AccountId,
            id: u32,
        ) -> Result<(), HighlightedPostsError> {
            if Self::env().caller() != self.created_by {
                return Err(HighlightedPostsError::AccessDenied)
            }
            if self.highlighted.contains(author) {
                return Result::Err(HighlightedPostsError::AlreadyHighlighted);
            } else {
                self.highlighted.insert(author, &id);
                Self::emit_event(
                    Self::env(),
                    Event::PostHighlighted(PostHighlighted { author, id }),
                );
                Ok(())
            }
        }

        /// Simply returns the ID of the highlighted post by the `author`.
        #[ink(message)]
        pub fn get_by_author(&self, author: AccountId) -> Option<u32> {
            self.highlighted.get(author)
        }

        /// Deletes the post by the author.
        ///
        /// NOTE: This is rather unrealistic example where *anyone* can remove
        /// any post but this contract is only meant to show how to do
        /// cross-contract calls.
        #[ink(message)]
        pub fn delete_by_author(
            &mut self,
            author: AccountId,
        ) -> Result<(), HighlightedPostsError> {
            if Self::env().caller() != self.created_by {
                return Err(HighlightedPostsError::AccessDenied)
            }
            if !self.highlighted.contains(author) {
                return Err(HighlightedPostsError::HighlightNotFound);
            } else {
                self.highlighted.remove(author);
                Self::emit_event(
                    Self::env(),
                    Event::HighlightRemoved(HighlightRemoved { author }),
                );
                Ok(())
            }
        }

        /// Returns an address of the contract/account that instantiated this instance.
        #[ink(message)]
        pub fn created_by(&self) -> AccountId {
            self.created_by
        }

        // We need this helper method for emitting events (rather than
        // `Self::env().emit_event(_)`) because compiler will fail to
        // resolve type boundaries if there are events from another, dependent
        // contract. To verify, try replacing calls to
        // `Self::emit_event` with `self::env().emit_event(_)` in the
        // `../lib.rs`.
        fn emit_event<EE>(emitter: EE, event: Event)
        where
            EE: EmitEvent<HighlightedPosts>,
        {
            emitter.emit_event(event);
        }
    }
}
