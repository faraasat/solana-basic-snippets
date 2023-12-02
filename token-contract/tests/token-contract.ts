import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenContract } from "../target/types/token_contract";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { assert } from "chai";

describe("token-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // retrieve the token contract struct from our smart contract
  const program = anchor.workspace.TokenContract as Program<TokenContract>;

  // generate a random keypair that will mint our token
  const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  // associatedTokenAccount for anchor's workspace
  let associatedTokenAccount = undefined;

  it("Mint Token", async () => {
    // get anchor wallet's public key
    const key = anchor.AnchorProvider.env().wallet.publicKey;

    // Get the amount of SOL needed to pay rent for our Token Mint
    const lamports: number =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );

    // Get the ATA for the token and account that we want to own the ATA (but it might not exist on the SOL)
    associatedTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      key
    );

    // fires a list of instructions
    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: key,
        newAccountPubkey: mintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      })
    );

    // fires a txn to create our mint account that is controlled by our anchor wallet
    createInitializMintInstruction(mintKey.publicKey, 0, key, key);

    // created the ATA for our mint on our anchor wallet
    createAssociatedTokenAccountInstruction(
      key,
      associatedTokenAccount,
      key,
      mintKey.publicKey
    );

    // send and create the transaction
    const result = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [
      mintKey,
    ]);

    console.log("Account: ", result);
    console.log("Mint Key: ", mintKey.publicKey.toString());
    console.log("User: ", key.toString());

    // executes our code to mint out token to our specific ATA
    await program.methods
      .mintToken()
      .accounts({
        mint: mintKey.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenAccount: associatedTokenAccount,
        authority: key,
      })
      .rpc();

    // get minted token account on the ATA for our anchor wallet
    const minted = (
      await program.provider.connection.getTokenAccountBalance(
        associatedTokenAccount
      )
    ).value.amount;

    assert.equal(minted, "10");
  });

  it("Transfer Token", async () => {
    // get anchor's wallet's public key
    const myWallet = anchor.AnchorProvider.env().wallet.publicKey;

    // wallet that will recieve the token
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();

    // the ATA for a token on the toWallet
    const toATA = await getAssociatedTokenAddress(
      mintKey.publicKey,
      toWallet.publicKey
    );

    const transfer_tx = new anchor.web3.Transaction().add(
      createAssociatedTokenAccountInstruction(
        myWallet,
        toATA,
        toWallet.publicKey,
        mintKey.publicKey
      )
    );

    // sends and create a transaction
    await anchor.AnchorProvider.env().sendAndConfirm(transfer_tx, []);

    await program.methods.transferToken().accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccount,
      from_authority: myWallet,
      to: toATA,
    });

    // get the transferred amount
    const not_minted = (
      await program.provider.connection.getTokenAccountBalance(
        associatedTokenAccount
      )
    ).value.amount;

    assert(not_minted, "5");
  });
});
