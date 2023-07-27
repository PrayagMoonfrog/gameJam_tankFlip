const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  start() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this, true);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
    this.connectToServer();
  }
  private webSocket: WebSocket = null;

  onTouchMove(event) {
    var touchPos = event.getLocation();
    console.log("");
  }
  connectToServer() {
    console.log("connectToServer");
    const serverURL = "wss://igludo-dev16-01.ludoclub.in"; // Replace with your server URL
    this.webSocket = new WebSocket(serverURL);

    // Register WebSocket event listeners
    this.webSocket.addEventListener("open", this.onWebSocketOpen.bind(this));
    this.webSocket.addEventListener("message", this.onWebSocketMessage.bind(this));
    this.webSocket.addEventListener("error", this.onWebSocketError.bind(this));
    this.webSocket.addEventListener("close", this.onWebSocketClose.bind(this));
    setInterval(() => {
      this.sendMessageToServer("client A");
    }, 100);
  }

  private onWebSocketOpen() {
    console.log("WebSocket connection opened");
    // You can send initial messages or perform other actions when the connection is open.
  }

  private onWebSocketMessage(event: MessageEvent) {
    console.log("Received message:", event.data);
    // Process the received message from the server.
  }

  private onWebSocketError(event: ErrorEvent) {
    console.error("WebSocket error:", event.message);
    // Handle any WebSocket errors here.
  }

  private onWebSocketClose(event: CloseEvent) {
    console.log("WebSocket connection closed:", event.reason);
    // Handle the WebSocket connection being closed.
  }

  getWorldPosOfNode = (node: cc.Node = null): cc.Vec2 => {
    if (node == null) return new cc.Vec2(cc.view.getDesignResolutionSize().width / 2, cc.view.getDesignResolutionSize().height / 2); // world position of center of canvas
    // simply convert the node local positon to world position
    return node.convertToWorldSpaceAR(cc.Vec2.ZERO);
  };

  sendMessageToServer(message: string) {
    console.log("sendMessageToServer ", message);
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else if (this.webSocket.readyState === WebSocket.CONNECTING) {
      // WebSocket is still connecting, wait for it to open
      this.webSocket.addEventListener("open", () => {
        this.webSocket.send(message);
      });
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  }
}
