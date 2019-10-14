﻿var contentType = "";
var searchAddress = false;

$(document).ready(function () {

    $('.searchautocomplete').autocomplete({
        source: function (request, response) {
            var searchTerm = request.term;
            var filterBy = $('.filterby').val();
            $.ajax({
                dataType: "json",
                type: 'Get',
                url: '/searchHandler',
                data: { term: searchTerm, filterby: filterBy },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            label: item.split('\t')[0],
                            value: item.split('\t')[1],
                            desc: item.split('\t')[2],
                            typeval: item.split('\t')[3],
                            checkMark: item.split('\t')[4],
                            logo: item.split('\t')[5]
                        };
                    }));
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        },
        autoFocus: true,
        delay: 100,
        minLength: 1,
        select: function (event, ui) {
            event.preventDefault();
            var typeval = ui.item.typeval;
            if (typeval == "" && ui.item.label == "Addresses") {
                typeval = 3;
                ui.item.value = $("#hdnSearchText").val();
            }
            else if (typeval == "" && ui.item.label == "Tokens") {
                typeval = 2;
                ui.item.value = $("#hdnSearchText").val();
            }
            else if (typeval == "" && ui.item.label == "Labels") {
                typeval = 5;
                ui.item.value = $("#hdnSearchText").val();
            }

            $(this).val('Searching ...');
            if (typeval == 1) {
                window.location.href = '/token/' + ui.item.label;
            } else if (typeval == 2) {
                window.location.href = '/token/' + ui.item.value;
            } else if (typeval == 3) {
                window.location.href = '/address/' + ui.item.value;
            } else if (typeval == 4) {
                window.location.href = '/address/' + ui.item.label;
            } else if (typeval == 5) {
                window.location.href = '/labelcloud/' + ui.item.value;
            }
        }
    }).addClass("list-unstyled py-3 mb-0").data("ui-autocomplete")._renderItem = function (ul, item) {
        var tickMark = '';
        var imglogo = '';
        if (item.checkMark === '1') {
            tickMark = "<i class='fa fa-badge-check text-info ml-auto' style='padding-right: 2px;'></i>";
        }
        if (item.logo !== '') {
            imglogo = "<img class='u-xs-avatar' style='margin-top: 1px;' src='/token/images/" + item.logo + "'>";
        }
        else {
            if (contentType === "Addresses") {
                var blockiesData = blockies.create({ seed: item.value.toLowerCase(), size: 8, scale: 16 }).toDataURL();
                imglogo = "<img class='u-xs-avatar rounded-circle' style='margin-top: 1px;' src='" + blockiesData + "'>";
            }
            else {
                imglogo = "<img class='u-xs-avatar' style='margin-top: 1px;' src='/images/main/empty-token.png'>";
            }
        }

        if (item.desc == "" && item.typeval == "" && item.checkMark == "" && item.logo == "") {
            contentType = item.label;
            return $("<li class='px-2 mt-2 mb-2 ether-search-heading'>").append("<div class='bg-light py-1 rounded'><span class='h6 font-weight-bold'>" + item.label + "</span></div>").appendTo(ul);
        } else {
            if (searchAddress == false) {
                if (contentType === "Labels") {
                    $("#hdnSearchText").val(item.label);
                } else {
                    $("#hdnSearchText").val(item.value);
                }                
                searchAddress = true;
            }

            if (contentType === "Tokens") {
                return $("<li class='px-2 mb-1'>")
                    .append("<div class='ether-search media rounded p-2'><div class='mr-2'>" + imglogo + "</div><div class='media-body text-truncate'><h6 class='d-flex align-items-center text-size-1 mb-0'>" + item.label + tickMark + "</h6>" + item.desc + "</div></div>")
                    .appendTo(ul);
            }
            else if (contentType === "Addresses") {
                return $("<li class='px-2 mb-1'>")
                    .append("<div class='ether-search media rounded p-2'><div class='mr-2'>" + imglogo + "</div><div class='media-body text-truncate'><h6 class='text-size-1 mb-0 text-truncate'>" + item.label.substring(0, 42) + "</h6></div></div>")
                    .appendTo(ul);
            }
            else if (contentType === "Labels") {
                return $("<li class='px-2 mb-1'>")
                    .append("<div class='ether-search media rounded p-2'><div class='mr-2'><span class='btn btn-xs btn-icon btn-soft-secondary rounded-circle'><i class='fa fa-tag btn-icon__inner'></i></span></div ><div class='media-body text-truncate'><h6 class='text-size-1 mb-0'>" + item.label.substring(0, 42) + "</h6></div></div>")
                    .appendTo(ul);
            }
        }
    };

    $('.filterby').change(function () {
        var val = $('.searchautocomplete').val();
        $('.searchautocomplete').autocomplete('search', val);
    });

    $(".page-link").click(function (a) { var b = $("#spinwheel"); b.show(), setTimeout(function () { b.button("reset") }, 0) }),

        $("#txtSearchInput").val('');
    //$("#txtSearchInput").customAutocomplete();
    $("#txtSearchInputMobile").val('');
    //$("#txtSearchInputMobile").customAutocomplete();
}), window.onpageshow = function (a) {
    a.persisted && $("#spinwheel").hide();
};