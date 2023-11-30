use anchor_lang::prelude::*;

declare_id!("2zz4zSSMVPc291qsiYtDdRDENXqJgmRhzmVX4WEm5Bh6");

#[program]
pub mod n3_hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
