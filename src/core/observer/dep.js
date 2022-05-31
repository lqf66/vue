/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

/// 每个 dep 都有其 id
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    /// 存放 watcher
    this.subs = []
  }

  /// 推入 watcher
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  /// 删除 watcher
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  /// 调用 watcher 的 addDep 方法
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      /// 排个序
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  /// 可能会有栈结构
  Dep.target = targetStack[targetStack.length - 1]
}
