//import { test, expect } from '@playwright/test';
import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress'; 
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { Context } from 'wagmi';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const {expect} = test;

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test('Should show form when connected, otherwise not', async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('/')
  //We check that we see "Please Connect Wallet"
  await expect(page.getByText('Please Connect')).toBeVisible();

  //We create a new Metamask instance
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
});
