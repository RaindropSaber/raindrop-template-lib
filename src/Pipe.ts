import {
  T_Node,
  type T_Pipe,
  T_Package,
  NodeType,
  T_Port,
  RuntimeEnv,
  PortType,
  T_JSON,
  PackageType,
  type T_PipePackage,
} from 'rlang-grammar';
import type Port from './Port';
import type Graph from './Graph';

type T_PipeOption = Pick<T_Pipe, 'id' | 'attribute'>;

export default class Pipe {
  static meta: T_PipePackage;
  option: T_PipeOption;
  graph!: Graph;
  get meta() {
    return (this.constructor as typeof Pipe).meta;
  }

  get id() {
    return this.option.id;
  }

  get name() {
    return this.meta.name;
  }

  get desc() {
    return this.meta.desc;
  }

  get env() {
    return this.meta.env;
  }

  constructor(option: T_PipeOption) {
    this.option = option;
  }

  attach(graph: Graph) {
    this.graph = graph;
  }

  disconnect() {
    throw new Error(`need to connect first`);
  }

  connect<G_O, G_I extends G_O>(OUT: Port<G_O>, IN: Port<G_I>) {
    const unsubscribe = OUT.on((ctx) => {
      ctx.to(IN);
    });
    this.disconnect = () => {
      unsubscribe();
      this.disconnect = () => {
        throw new Error(`need to connect first`);
      };
    };
  }
}
