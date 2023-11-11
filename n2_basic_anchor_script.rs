use anchor_lang::prelude::*;

// this will be the key
declare_id!("2dd08216-8094-11ee-b962-0242ac120002");

// #[program] is used by anchor to define a program
#[program]
mod basic_1 {
    use super::*;

    // each function below maps to an instruction attribute

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(());
    }

    pub fn update(ctx: Context<Update>, data: u64) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(());
    }
    // each function takes a context which is a container that holds the Account data we define. Afterward that we have unlimited amount of custom instructions we can send.
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // we have #[account] attribute to define specific behavior for our account that we use
    // init is to create account
    // payer is the signer that is paying to create the account
    // space is the space that account will take up. Always 8 for hash of the account + the data size of the account
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    // here mut means we can modify the account
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account[mut]]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub data: u64,
}
