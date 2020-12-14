// const SIGNENDPOINT = 'https://flzoom.herokuapp.com/'
const SIGNENDPOINT = '/signature'

$(document).on('click', '#join', function()
{
    var foo = getMeetingConfig()
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
                foo.apiKey = res.apiKey
                var src = '/meeting.html?' + testTool.serialize(foo)
                $('iframe').attr('src', src)
            }
        })
    }

    $('.signature').text(foo.signature)
    $('.url').text(src)
    $('iframe').attr('src', src)
})

$(document).on('change', 'select', function()
{
    $(this).next('input[disabled="disabled"]').val($(this).val())
    $('#pwd').val($(this).find('option:selected').attr('pwd'))
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
