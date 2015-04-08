function save_options() {

    var url = $('#url').val();
    $status = $('#status');
    resetStatus();

    //Test the url shortener service
    $status.html('saving');

    try
    {
        chrome.storage.sync.get('options', function(val) {
            var options = val.options;
            //use chrome sync storage
            var options = {
                username: $('#username').val(),
                password: $('#password').val()
            };
            chrome.storage.sync.set({'options': options}, function() {
                $status.html('changes saved, click on the icon again!');
                hideStatus();
            });
        });
    }
    catch(e)
    {
        showError();
    }
}

function showError()
{
    $status.removeClass('alert-info');
    $status.addClass('alert-danger');
    $status.html('ERROR: The given url is not a valid url shortener service.');
    setTimeout(function() {
        $status.fadeOut('slow');
    }, 2000);
}

function restore_options() {
    $('#status').hide();
    chrome.storage.sync.get('options', function(val) {
        var options = val.options;
        if (!options.username) return;
        $('#username').val(options.username);
        if (!options.password) return;
        $('#password').val(options.password);
    });
}

function resetStatus()
{
    //Reset message
    $status.addClass('alert-info');
    $status.removeClass('alert-danger');
    $status.fadeIn('slow');
}

function hideStatus()
{
    setTimeout(function() {
        $status.fadeOut('slow');
    }, 2000);
}

$(document).ready(function(){

    restore_options();

    $('form').submit(function(event){
        save_options();
        event.preventDefault();
    });
});