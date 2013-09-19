var manageChatRooms = function () {
    if (!top.chat)
        return;

    var chat = top.chat;

    chat.onChatStarted( function() {
        function fillInRoomTable(rooms) {
            var html = [];

            jQuery.each(rooms, function(i, room) {
                html.push('<tr class="room">');
                html.push('<td class="name">' + room.name.replace(/_/g, ' ') + '</td>');
                html.push('<td><label><input name="r' + room.id + '" ' + (room.status == "open" /*|| room.status == "minimized"*/ ? 'checked="checked"': '') + ' type="radio" value="0">Open</label></td>');
                html.push('<td><label><input name="r' + room.id + '" ' + (room.status == "minimized" ? 'checked="checked"': '') + ' type="radio" value="1">Minimized</label></td>');
                if (room.name != "Faction" && room.name != "Company") {
                    html.push('<td><label><input name="r' + room.id + '" ' + (room.status == "closed" ? 'checked="checked"': '') + ' type="radio" value="2">Closed</label></td>');
                }
                html.push('</tr>');
            });

            var table = jQuery('.chatEnabled .chatRooms');

            table.html(html.join(""));

            if (html.length > 0)
                jQuery('.chatEnabled').show();
            jQuery('.chatDisabled').hide();

            table.find('label input[type=radio]').parent().click(function () {
                var input = jQuery(this).find("input").get(0);
                input.checked = "checked"; // shouldn't be necessary, but IE6 is weird
                chat.setRoomStatus(input.name.substring(1), +input.value);
            });
        }

        // setup listener
        function listenForRoomChanges() {
            chat.listenForRoomChanges("managerooms", function () {
                // wait a little to catch simultaneous changes at start
                setTimeout(function () {
                    listenForRoomChanges();
                    fillInRoomTable(chat.rooms);
                }, 200);
            });
        }

        listenForRoomChanges();


        // enable chat button
        jQuery('.chatDisabled a').click(function (e) {
            e.preventDefault();
            chat.start();
        });

        // create room
        var createWidgets = jQuery('.chatEnabled .addChatRoom .inside');

        jQuery('.chatEnabled .addChatRoom a.toggle').click(function (e) {
            e.preventDefault();

            if (createWidgets.is(":hidden")) {
                createWidgets.slideDown(function () {
                    createWidgets.find('input').focus();
                });
            }
            else
                createWidgets.slideUp();
        });

        var createButton = createWidgets.find(".create");
        createButton.attr('disabled', 'disabled');

        var usersForNewRoom = [];

        createButton.click(function (e) {
            e.preventDefault();
            if (usersForNewRoom.length == 0)
                return;

            usersForNewRoom.push("self")
            chat.setupRoom(usersForNewRoom);

            createButton.attr('disabled', 'disabled');
            usersForNewRoom = [];
            createWidgets.slideUp();
        });

        function onUsersChanged(list) {
            usersForNewRoom = [];
            jQuery.each(list, function (i, v) {
                v = jQuery.trim(v);
                if (v != "")
                    usersForNewRoom.push(v);
            });

            if (usersForNewRoom.length > 0)
                createButton.removeAttr('disabled');
            else
                createButton.attr('disabled', 'disabled');
        }

        createWidgets.find('input[name=usersInRoom]')
            .tokenInput("/torncity/autocomplete/users", {
                onTokensChanged: onUsersChanged,
                hintText: "Type in a player name"
            });

        // now let's get started
        if (chat.running) {
            fillInRoomTable(chat.rooms);
        }
        else {
            jQuery('.chatEnabled').hide();
            jQuery('.chatDisabled').show();
        }
    } )
};