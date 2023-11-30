<!-- to generate a keypair in default location -->

solana-keygen new

<!-- to install anchor cli -->

cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

git clone https://github.com/coral-xyz/anchor.git

<!-- to generate keypair -->

solana-keygen new <optional>

<!-- navigate to the project and then -->

yarn install

anchor build

solana address -k target/deploy/<project-name>-keypair.json

Add the address to declare_id!() macro

run anchor build again to build with a new id

run "solana-test-validator" in another terminal

anchor deploy

# Anchor Commands

anchor init <project-name>

anchor build

anchor deploy

anchor test

anchor -h
