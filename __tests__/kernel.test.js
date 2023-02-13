'use strict';

const { Node, Pipe } = require('..');
const {
  T_Node,
  T_Pipe,
  T_Package,
  NodeType,
  T_Port,
  RuntimeEnv,
  PortType,
  T_JSON,
  T_AST,
  PackageType,
} = require('rlang-grammar');

class R extends Node {
  static meta = {
    id: 'RRRRR',
    type: NodeType.R,
    name: 'RRRRR',
    desc: 'RRRRR',
    env: [RuntimeEnv.Node],
  };
  ready($I, $O) {
    new Context().send({ rrr: 'rrr' }).to($O('out'));
  }
}

class W extends Node {
  static meta = {
    id: 'WWWWW',
    type: NodeType.W,
    name: 'WWWWW',
    desc: 'WWWWW',
    env: [RuntimeEnv.Node],
  };
  ready($I) {
    $I('in').on((msg) => {
      console.log(`msg`, msg);
    });
  }
}

const pipe = new Pipe();

const rNode = new R({
  nodeId: '12345',
  ports: [
    {
      id: 'out',
      type: 'OUT',
      name: 'string',
      desc: 'string',
    },
  ],
  attribute: { ddd: 'ddd' },
});
const wNode = new W({
  nodeId: '67890',
  ports: [
    {
      id: 'in',
      type: 'IN',
      name: 'string',
      desc: 'string',
    },
  ],
  attribute: { ddd: 'ddd' },
});

pipe(rNode, wNode);
