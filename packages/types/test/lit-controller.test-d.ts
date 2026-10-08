import { MachineController } from '@destyler/lit'
import { expectTypeOf } from 'vitest'

class ConsumerController extends MachineController<{ count: number }, { value: 'idle' }> {
  public connected: boolean = false
}

expectTypeOf<ConsumerController['connected']>().toEqualTypeOf<boolean>()
