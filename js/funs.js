function toggleBox()
{
    $('#demo3sdk-box').toggle()
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
