const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletComponent extends cc.Component {
  start() {}

  move(dir: cc.Vec2) {
    dir = cc.v2(1, 0);
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(dir.x, dir.y);
  }
}
