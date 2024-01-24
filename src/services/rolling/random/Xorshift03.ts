// From http://baagoe.com/en/RandomMusings/javascript/
// Version Xorshift03 0.9
import { Mash } from '@/services/rolling/random/Mash'

export function Xorshift03(args: any[] = [+new Date]): () => number {
  // George Marsaglia, 13 May 2003
  // http://groups.google.com/group/comp.lang.c/msg/e3c4ea1169e463ae
  let x: number = 123456789,
    y: number = 362436069,
    z: number = 521288629,
    w: number = 88675123,
    v: number = 886756453

  const mash: (data: any) => number = Mash()
  for (let i = 0; i < args.length; i++) {
    x ^= mash(args[i]) * 0x100000000 // 2^32
    y ^= mash(args[i]) * 0x100000000
    z ^= mash(args[i]) * 0x100000000
    v ^= mash(args[i]) * 0x100000000
    w ^= mash(args[i]) * 0x100000000
  }

  const uint32 = function() {
    const t = (x ^ (x >>> 7)) >>> 0
    x = y
    y = z
    z = w
    w = v
    v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0
    return ((y + y + 1) * v) >>> 0
  }

  return function() {
    return uint32() * 2.3283064365386963e-10 // 2^-32
  }
}
