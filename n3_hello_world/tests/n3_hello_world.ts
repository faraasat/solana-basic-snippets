import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { N3HelloWorld } from "../target/types/n3_hello_world";

describe("n3_hello_world", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.N3HelloWorld as Program<N3HelloWorld>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
