export function __async(__this: any, __arguments: any, generator: any) {
  return new Promise((resolve, reject) => {
    const fulfilled = (value: any) => {
      try {
        step(generator.next(value))
      }
      catch (e) {
        reject(e)
      }
    }
    const rejected = (value: any) => {
      try {
        step(generator.throw(value))
      }
      catch (e) {
        reject(e)
      }
    }
    var step = (x: any) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected)
    step((generator = generator.apply(__this, __arguments)).next())
  })
}
