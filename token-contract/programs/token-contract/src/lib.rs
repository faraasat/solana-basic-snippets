use anchor_lang::prelude::*;
use anchor_spl::token::{MintTo, Token, Transfer};

declare_id!("Cs7QvsfAT5QKxCWQ5Nb7pVLG7N2XxLzg3eVjt8csEXrA");

#[program]
pub mod token_contract {
    use anchor_spl::token::{self};

    use super::*;

    pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
        // create the MintTo struct for our cpi context
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();

        // create the cpi context we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // execute anchor's helper functions to mint tokens
        token::mint_to(cpi_ctx, 10)?;

        Ok(())
    }

    pub fn transfer_token(ctx: Context<TransferToken>) -> Result<()> {
        // create the transfer token struct
        let transfer_instructions = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();

        // create the context
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instructions);

        // execute anchor's helper function to mint tokens
        anchor_spl::token::transfer(cpi_ctx, 5)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    // this is the token we want to mint
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    // this is the account we want to mint token to
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    // this is the authority of the mint token
    #[account(mut)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
    pub token_program: Program<'info, Token>,

    // the associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,

    // the associated token account that we are transferring the token to
    #[account(mut)]
    pub to: UncheckedAccount<'info>,

    // authority of txn -> the from account
    #[account(mut)]
    pub from_authority: Signer<'info>,
}
