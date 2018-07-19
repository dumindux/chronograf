class Debouncer {
  private timers

  constructor() {
    this.timers = {}
  }

  public call(f, ms) {
    const timer = this.timers[f]

    if (timer) {
      clearTimeout(timer)
    }

    this.timers[f] = setTimeout(f, ms)
  }

  public cancel(f) {
    const timer = this.timers[f]

    if (timer) {
      clearTimeout(timer)
    }
  }

  public cancelAll() {
    const timers: number[] = Object.values(this.timers)

    for (const timer of timers) {
      clearTimeout(timer)
    }
  }
}

export default Debouncer
