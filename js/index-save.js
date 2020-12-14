// import { ZoomMtg } from "./node_modules/@zoomus/websdk"

// For CDN version default
ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.8.3/lib', '/av')

// For Global use source.zoom.us:
// ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.3/lib', '/av')

// In China use jssdk.zoomus.cn:
// ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.8.3/lib', '/av')


const API_KEY = 'PQzQIKdbRjuhJu3w9XQS2g'
const API_SECRET = "tQpPwgiFchDJ3R5Koelaw3IqqQNDP8wir5Kf"
// const SIGNENDPOINT = 'https://flzoom.herokuapp.com/'
const SIGNENDPOINT = '/signature'

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

function getFormData()
{
    var data = {}
    var meetingNumber = parseInt($('#metid').val())
    var passWord = $('#pwd').val()
    var role = 0

    data.name = ''
    data.email = ''
    data.lang = 'en-US'
    data.china = 0

    $(['name','email','lang','china']).each(function(k,v)
    {
        var foo = $('input[name="' + v + '"]').val()
        if (foo)
            data[v] = foo
    })

    if (!meetingNumber)
        alert('no meeting ID')
    if ($('input[name="role"]').is(':checked'))
        role = 1

    data.name = testTool.b64EncodeUnicode(data.name)
    data.email = testTool.b64EncodeUnicode(data.email)
    data.meetingNumber = meetingNumber
    data.passWord = passWord
    data.role = parseInt(role, 10)
    return data
}

function getMeetingConfig()
{
    var foo = getFormData()
    return {
        mn: parseInt(foo.meetingNumber),
        name: testTool.b64DecodeUnicode(foo.name),
        pwd: foo.passWord,
        role: parseInt(foo.role, 10),
        email: testTool.b64DecodeUnicode(foo.email),
        lang: foo.lang,
        signature: "",
        china: foo.china
    }
}

$(document).on('change', 'select', function()
{
    $(this).next('input[disabled="disabled"]').val($(this).val())
    $('#pwd').val($(this).find('option:selected').attr('pwd'))
})

function toggleBox()
{
    $('#demo3sdk-box').toggle()
}

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

/**
 * create meeting.
 */
function createMeeting()
{
    var cmData = {
        topic: "API Test",
        type: 2,
        start_time: "2020-12-14 00:00:00",
        duration: 60,
        schedule_for: "",
        timezone: "America/New_York",
        password: "",
        agenda: "",
        recurrence: {
            type: 1,
            repeat_interval: 1,
            weekly_days: "",
            monthly_day: 1,
            monthly_week: 1,
            monthly_week_day: 1,
            end_times: 24,
            end_date_time: "2020-12-15 00:00:00"
        },
        settings: {
            host_video: false,
            participant_video: false,
            cn_meeting: false,
            in_meeting: false,
            join_before_host: true,
            mute_upon_entry: false,
            watermark: false,
            use_pmi: false,
            approval_type: 2,
            registration_type: 0,
            audio: "both",
            auto_recording: "local",
            enforce_login: false,
            enforce_login_domains: "",
            alternative_hosts: "",
            global_dial_in_countries: [],
            registrants_email_notification: false
        }
    }
}

/**
 * create meeting, join with websdk signature.
 */
$(document).on('click', '#create-join', function()
{
    const gmc = getMeetingConfig()

    if (gmc.role == 1)
    {
        createMeeting()
    }

    websdkSignJoin(gmc)
})
