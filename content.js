function fillValue(name, value, dataType)
{
    console.log(name + ": " + value);
    if($('select:regex(name,' + name + ') option[value="' + value + '"]').length > 0)
    {
        $('select:regex(name,' + name + ')').val(value);
        return true;
    }
    if($('input:regex(name,' + name + ')').length > 0)
    {
        $('input:regex(name,' + name + ')').val(value);
        return true;
    }
    if($('input:regex(id,' + name + ')').length > 0)
    {
        $('input:regex(id,' + name + ')').val(value);
        return true;
    }
    if($('label:Containsi(' + name + ')').length)
    {
        var label = $('label:Containsi(' + name + ')');
        if(label.attr('for') != null)
        {
            $('#' + label.attr('for')).val(value);
        }
        else
        {
            nextInDOM('select',label).val(value);
            nextInDOM('input',label).val(value);
        }
    }
    console.log("found nothing");
    return false;
}

function fillValues(fieldNames, values, dataType)
{
    $.each(fieldNames.split(';'), function(fnKey, fieldName)
    {
        var flag = true;
        $.each(values.split(';'), function(vKey, value)
        {
            if(fillValue(fieldName, value, dataType))
            {
                console.log("found it!");
                flag = false;
                return false;
            }
        });
        return flag;
    });
}

//Regex extension
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

//Containsi Case insensitive
jQuery.expr[':'].Containsi = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

//Find ne3xt in html disregard DOM Tree
function nextInDOM(_selector, _subject) {
    var next = getNext(_subject);
    while(next.length != 0) {
        var found = searchFor(_selector, next);
        if(found != null) return found;
        next = getNext(next);
    }
    return null;
}
function getNext(_subject) {
    if(_subject.next().length > 0) return _subject.next();
    return getNext(_subject.parent());
}
function searchFor(_selector, _subject) {
    if(_subject.is(_selector)) return _subject;
    else {
        var found = null;
        _subject.children().each(function() {
            found = searchFor(_selector, $(this));
            if(found != null) return false;
        });
        return found;
    }
    return null; // will/should never get here
}