/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

/// 原型链
const arrayProto = Array.prototype
/// 获取其原型链
export const arrayMethods = Object.create(arrayProto)

/// 7 个能改变的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  /// 修改其每个方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    /// 获取原结果
    const result = original.apply(this, args)
    /// 获取响应式
    const ob = this.__ob__
    let inserted
    /// 三个有可能增加元素的方法
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }

    /// 新增加的也要响应式
    if (inserted) ob.observeArray(inserted)
    // notify change
    /// 通知更新
    ob.dep.notify()
    return result
  })
})
