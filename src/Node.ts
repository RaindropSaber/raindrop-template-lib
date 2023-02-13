import {
  type T_Node,
  T_Pipe,
  NodeType,
  T_Package,
  type T_Port,
  RuntimeEnv,
  PortType,
  T_JSON,
  PackageType,
  type T_NodePackage,
} from 'rlang-grammar';
import Port from './Port';
import type Graph from './Graph';
import Context from './Context';

type T_NodeOption = Pick<T_Node, 'id' | 'attribute' | 'ports'>;

type T_PortMap<K> = Map<keyof K, Port<Get<K, keyof K>>>;
type Get<T, K> = K extends keyof T ? T[K] : never;
export interface DefaultPortsDTO {
  [PortType.I]: Record<string, {}>;
  [PortType.O]: Record<string, {}>;
}
export type $I<G extends DefaultPortsDTO> = <T extends keyof G[PortType.I]>(id: T) => Port<Get<G[PortType.I], T>>;
export type $O<G extends DefaultPortsDTO> = <T extends keyof G[PortType.O]>(id: T) => Port<Get<G[PortType.O], T>>;

export default class Node<G_PortsDTO extends DefaultPortsDTO = DefaultPortsDTO> {
  static meta: T_NodePackage;
  option: T_NodeOption;
  graph!: Graph;
  ports!: Array<Port<Get<G_PortsDTO[PortType], keyof G_PortsDTO[PortType]>>>;
  portIMap!: T_PortMap<G_PortsDTO[PortType.I]>;
  portOMap!: T_PortMap<G_PortsDTO[PortType.O]>;
  $I!: $I<G_PortsDTO>;
  $O!: $O<G_PortsDTO>;

  get meta() {
    return (this.constructor as typeof Node).meta;
  }

  get type() {
    return this.meta.type;
  }

  get nodeType() {
    return this.meta.nodeType;
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

  get id() {
    return this.option.id;
  }

  get attribute() {
    return this.option.attribute;
  }

  get app() {
    return this.graph.app || {};
  }

  private attachPort(option: T_Port) {
    const port = new Port<Pick<G_PortsDTO[PortType], keyof G_PortsDTO[PortType]>[keyof G_PortsDTO[PortType]]>(option);
    port.attach(this);
    option.type === PortType.I ? this.portIMap.set(port.id, port) : this.portOMap.set(port.id, port);
    return port;
  }

  private initPort() {
    this.ports = this.option.ports.map((portOption) => this.attachPort(portOption));

    const $I = (id: keyof G_PortsDTO[PortType.I]) => {
      if (!this.portIMap.has(id)) throw new Error(`node ${this.name} has no port that id is ${id as string}`);
      return this.portIMap.get(id)!;
    };
    const $O = (id: keyof G_PortsDTO[PortType.O]) => {
      if (!this.portOMap.has(id)) throw new Error(`node ${this.name} has no port that id is ${id as string}`);
      return this.portOMap.get(id)!;
    };
    this.$I = $I;
    this.$O = $O;
  }

  constructor(option: T_NodeOption) {
    this.option = option;
    this.portIMap = new Map();
    this.portOMap = new Map();

    this.initPort();
  }

  attach(graph: Graph) {
    this.graph = graph;
  }

  ready($I: $I<G_PortsDTO>, $O: $O<G_PortsDTO>) {}
  send<T>(msg: T) {
    return new Context<T>(msg);
  }
}
