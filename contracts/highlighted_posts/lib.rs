#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use highlighted_posts::{
    HighlightedPostsError, HighlightedPostsRef, DELETE_HIGHLIGHT_SELECTOR,
    GET_BY_AUTHOR_SELECTOR, HIGHLIGHTED_POSTS_SELECTOR,
    HIGHLIGHT_POST_SELECTOR,
};

#[ink::contract]
mod highlighted_posts {
    use ink::{codegen::EmitEvent, prelude::vec::Vec, storage::Mapping};

    // Selectors are short byte arrays that uniquely identify the methods of
    // the contract. We need them to construct the `CallBuilder` instance.
    // They can be found by expanding the `#[ink::contract]` macro.

    pub const HIGHLIGHTED_POSTS_SELECTOR: [u8; 4] = [0, 0, 0, 6];

    pub const HIGHLIGHT_POST_SELECTOR: [u8; 4] = [0, 0, 0, 7];

    pub const DELETE_HIGHLIGHT_SELECTOR: [u8; 4] = [0, 0, 0, 8];

    pub const GET_BY_AUTHOR_SELECTOR: [u8; 4] = [0, 0, 0, 9];

    type Event = <HighlightedPosts as ink::reflect::ContractEventBase>::Type;

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
    pub struct HighlightedPosts {
        created_by: AccountId,
        highlighted: Mapping<AccountId, u32>,
        highlighted_ids: Vec<AccountId>,
    }

    impl HighlightedPosts {
        /// Constructor that initializes the contract with empty map.
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                created_by: caller,
                highlighted: Mapping::default(),
                highlighted_ids: Vec::new(),
            }
        }

        /// Adds the post to the highlighted set.
        #[ink(message, payable, selector = 7)]
        pub fn add(
            &mut self,
            author: AccountId,
            id: u32,
        ) -> Result<(), HighlightedPostsError> {
            if Self::env().caller() != self.created_by {
                return Err(HighlightedPostsError::AccessDenied);
            }
            if self.highlighted.contains(author) {
                return Result::Err(HighlightedPostsError::AlreadyHighlighted);
            } else {
                self.highlighted.insert(author, &id);
                self.highlighted_ids.push(author);
                Self::emit_event(
                    Self::env(),
                    Event::PostHighlighted(PostHighlighted { author, id }),
                );
                Ok(())
            }
        }

        /// Deletes the post by the author.
        ///
        /// NOTE: This is rather unrealistic example where *anyone* can remove
        /// any post but this contract is only meant to show how to do
        /// cross-contract calls.
        #[ink(message, selector = 8)]
        pub fn delete_by_author(
            &mut self,
            author: AccountId,
        ) -> Result<(), HighlightedPostsError> {
            if Self::env().caller() != self.created_by {
                return Err(HighlightedPostsError::AccessDenied);
            }
            if !self.highlighted.contains(author) {
                return Err(HighlightedPostsError::HighlightNotFound);
            } else {
                self.highlighted.remove(author);
                self.highlighted_ids
                    .retain(|post_author| post_author != &author);
                Self::emit_event(
                    Self::env(),
                    Event::HighlightRemoved(HighlightRemoved { author }),
                );
                Ok(())
            }
        }

        /// Simply returns the ID of the highlighted post by the `author`.
        #[ink(message, selector = 9)]
        pub fn get_by_author(&self, author: AccountId) -> Option<u32> {
            self.highlighted.get(author)
        }

        /// Returns account IDs for which we have highlighted posts
        #[ink(message, selector = 6)]
        pub fn highlighted_posts(&self) -> Vec<AccountId> {
            self.highlighted_ids.clone()
        }

        /// Returns an address of the contract/account that instantiated this
        /// instance.
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
