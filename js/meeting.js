// import { ZoomMtg } from "./node_modules/@zoomus/websdk"

// For CDN version default
ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.8.3/lib', '/av')

// For Global use source.zoom.us:
// ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.3/lib', '/av')

// In China use jssdk.zoomus.cn:
// ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.8.3/lib', '/av')

ZoomMtg.preLoadWasm()
ZoomMtg.prepareJssdk()

console.log(testTool.parseQuery())
joinMeeting(testTool.parseQuery())
