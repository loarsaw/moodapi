/*
  decoratore singleton, rende una classe singleton, la prima creata verrà sempre restituita
*/
/****************************************************************************************************************** */
export const key = Symbol()
/****************************************************************************************************************** */
export type Singleton<B extends new (...args: any[]) => any> = B & {
    [key]: B extends new (...args: any[]) => infer A ? A : never
}
/****************************************************************************************************************** */
export const Singleton = <B extends new (...args: any[]) => any>(type: B) =>
    new Proxy(type, {
        construct(target: Singleton<B>, argsList, newTarget) {
            // console.info(
            //     `%c PL-decorator Singleton -  Class: ${type.name} is in singleton mode...`,
            //     `color: blue `,
            // )
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argsList, newTarget)
            }
            if (!target[key]) {
                target[key] = Reflect.construct(target, argsList, newTarget)
            }
            return target[key]
        },
    })

/****************************************************************************************************************** */
