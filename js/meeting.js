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

$(document).on('click', '#join', function()
{
    var foo = getMeetingConfig()
    foo.apiKey = API_KEY
    var data = {
        meetingNumber: foo.mn,
        role: foo.role
    }
    var signature = $('#signature').val()

    if (signature)
    {
        foo.signature = signature
        var src = '/meeting.html?' + testTool.serialize(foo)
    } else {
        $.ajax({
            url: SIGNENDPOINT,
            type: 'post',
            data: data,
            success: function(res) {
                foo.signature = res.signature
                // var src = '/meeting.html?' + testTool.serialize(foo)
                // $('iframe').attr('src', src)
                joinMeeting(foo)
            }
        })
    }

    $('.signature').text(foo.signature)
    $('.url').text(src)
    $('iframe').attr('src', src)
})

/* ========================================================================== */

ZoomMtg.preLoadWasm()
ZoomMtg.prepareJssdk()

function joinMeeting(gmc)
{
    ZoomMtg.init({
        leaveUrl: 'index.html',
        isSupportAV: true,
        success: function() {
            toggleBox()
            ZoomMtg.join({
                signature: gmc.signature,
                apiKey: gmc.apiKey,
                meetingNumber: gmc.mn,
                userName: gmc.name,
                passWord: gmc.pwd,
                error(res) {
                    // console.log(res)
                }
            })
        }
    })
}

/**
 * use signature create by websdk to join.
 */
function websdkSignJoin(gmc)
{
    ZoomMtg.generateSignature({
        meetingNumber: gmc.mn,
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        role: gmc.role,
        success: function (res) {
            $('#signature').val(res.result)
            gmc.signature = res.result
            gmc.apiKey = API_KEY
            // console.log(gmc)
            joinMeeting(gmc)
        }
    })
}

/**
 * use signature create by php to join.
 */
function phpSignJoin(gmc)
{
    gmc.signature = $('#signature').val()

    if (!gmc.signature)
    {
        alert('no signature')
        return false
    }

    gmc.apiKey = API_KEY
    // console.log(gmc)
    joinMeeting(gmc)
}

$(document).on('click', '#websdk-sign-join', function()
{
    const gmc = getMeetingConfig()
    websdkSignJoin(gmc)
})

$(document).on('click', '#php-sign-join', function()
{
    var gmc = getMeetingConfig()
    phpSignJoin(gmc)
})
