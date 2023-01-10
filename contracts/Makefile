build-all:
	cargo contract build --quiet --release --manifest-path bulletin_board/Cargo.toml
	cargo contract build --quiet --release --manifest-path highlighted_posts/Cargo.toml

deploy:
	cargo contract upload --suri //Alice --skip-confirm --manifest-path highlighted_posts/Cargo.toml
	cargo contract upload --suri //Alice --skip-confirm --manifest-path bulletin_board/Cargo.toml
