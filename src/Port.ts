import { T_Node, NodeType, type T_Port, RuntimeEnv, PortType, T_JSON } from 'rlang-grammar';
import type Node from './Node';
import type Context from './Context';
import getId from './utils/getId';
import { Subject } from 'rxjs';

export default class Port<T_PortDTO> {
  $subject: Subject<Context<T_PortDTO>>;
  option: T_Port;
  node!: Node<any>;

  get id() {
    return this.option.id;
  }

  get type() {
    return this.option.type;
  }

  attach<T extends Node<any>>(node: T) {
    this.node = node;
  }

  constructor(option: T_Port) {
    this.option = option;
    this.$subject = new Subject<Context<T_PortDTO>>();
  }

  public emit(ctx: Context<T_PortDTO>) {
    this.$subject.next(ctx);
  }

  public on(next: (ctx: Context<T_PortDTO>) => void) {
    const sub = this.$subject.subscribe(next);
    return () => {
      sub.unsubscribe();
    };
  }
}
