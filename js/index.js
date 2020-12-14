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
                var src = '/meeting.html?' + testTool.serialize(foo)
                $('iframe').attr('src', src)
            }
        })
    }

    $('.signature').text(foo.signature)
    $('.url').text(src)
    $('iframe').attr('src', src)
})
