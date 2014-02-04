$(document).ready(function(){

    connectToGladdress();

    $('#content').on('click', 'a.gladid', function()
    {
        setMessage('Gathering information...','info');
        var gladId = $(this).attr('data-gladid');
        $.ajax({
            type: 'GET',
            url: 'http://gladdress.com/gladdress/' + gladId,
            error: function()
            {
                setMessage('Error', 'danger');
            },
            success: function(response)
            {
                setMessage('Filling in forms...','info');
                try
                {
                    console.log(response);
                    if(response.Fields != null)
                    {
                        $.each(response.Fields, function(key, field)
                        {
                            var fieldNames = [];
                            var values = [];

                            fieldNames.push(field.Key);
                            if(field.AlternativeKeys.length > 0)
                                $.each(field.AlternativeKeys.split(";"), function(fnKey, fieldName)
                                {
                                    fieldNames.push(fieldName);
                                    if(fieldName != fieldName.replace(' ',''))
                                        fieldNames.push(fieldName.replace(' ',''));
                                });

                            values.push(field.Value);
                            if(field.AlternativeValues.length > 0)
                                $.each(field.AlternativeValues.split(";"), function(vKey, altValue)
                                {
                                    values.push(altValue);
                                    if(altValue != altValue.replace(' ',''))
                                        values.push(altValue.replace(' ',''));
                                });

                            chrome.tabs.executeScript(null,{code:'fillValues("' + fieldNames.join(';')  + '","' + values.join(';') + '","' + field.DataType + '");'});
                        });
                        setMessage('Done!','success');
                        window.close();
                    }
                    else
                    {
                        setMessage('Error: Could not find any fields in profile', 'danger');
                    }
                }
                catch(e)
                {
                    setMessage(e.message, 'danger');
                }
            }
        });
    });
});

function connectToGladdress()
{
    setMessage('Connecting...','info');
    $.ajax({
        type: 'GET',
        url: 'http://gladdress.com/gladid',
        error: function()
        {
            setMessage('Error: Connection to service failed', 'danger');
        },
        success: function(response)
        {
            setMessage('Connected', 'success');
            try
            {
                console.log(response);
                if(response[0].GladId != null)
                {
                    $.each(response, function(key, value)
                    {
                        $('.profile-list').append('<a href="#" class="gladid list-group-item" data-gladid="'+ value.GladId + '"><h4>' + value.Name + '</h4><p>' + value.GladId + '</p></a>');
                    });
                }
                else
                {
                    setMessage('you are not logged in!<br /><a href="https://gladdress.azurewebsites.net" target="_blank">Please click here, login and try again</a>', 'warning');
                }
            }
            catch(e)
            {
                setMessage(e.message, 'danger');
            }
        }
    });
}

function setMessage(message, type)
{
    $('#status').html('<div class="alert alert-dismissable alert-' + type + '"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');
}