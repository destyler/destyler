import { TestSuite } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { expect } from 'vitest'

export class RadioTestSuite extends TestSuite {

  async ShouldHaveAriaLabelledByOnRoot(){
    await expect.element(this.rootEl()).toHaveAttribute('id')
    await expect.element(this.rootEl()).toHaveAttribute('aria-labelledby')
  }

  async ShouldBeCheckedWhenClicked(){
    
  }
}
