// regex pattern (?<!\d)\d{1,6}(?!\d)

// removes duplicated values in an array
function rmDuple(array) {
    if (array) {
        let uniqueArray = [];

        // Loop through array values
        for (i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }
    return null;
}


$(document).ready(function () {
    console.log('DOM ready.');

    $('form').on('submit', function (e) {
        e.preventDefault(); // prevents the form to action by itself

        // breaks down all 1 and 6 digit nuke codes
        let broken_codes = rmDuple($(this).find('textarea').val().match(/(?<!\d)\d{1,6}(?!\d)/g));
        console.log(broken_codes);

        $('#aftermath-list h4').html(`Found ${broken_codes ? broken_codes.length : 0} nuke code(s)!`);
        $('#aftermath-list ul.list-group').html('');

        if (broken_codes) {
            broken_codes.forEach(async (code, index) => {
                let body = new FormData();
                body['code'] = code;

                // retrieve doujin data
                await fetch('/nuke_codes', {
                    method: 'POST',
                    headers: new Headers({
                        //'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(body)
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);

                        let doujin = data;
                        let tags_div = document.createElement('div');

                        doujin['tags'].forEach((tag, i) => {
                            $(tags_div).append(`<small class="badge badge-secondary mr-1">${tag}</small>`)
                        })

                        $('#aftermath-list ul.list-group').append(`
                            <li id="${doujin['id']}" class="list-group-item list-group-item-${index % 2 == 0 ? 'light' : 'dark'} list-group-item-action rounded-sm mb-1" href="https://nhentai.net/g/${doujin['id']}">
                                <div class="d-flex w-100 justify-content-between">
                                    <img src="${doujin['poster_link']}" class="img-fluid img-thumbnail" width="80%">
                                    <div>
                                        <code class="text-light badge badge-dark">#${doujin['id']}</code>
                                    </div>
                                </div>
                                <div class="w-100">
                                    <p class="mb-1">${doujin['title_pretty']}</p>
                                    <small class="text-muted mb-1">${doujin['title_release']}</small>
                                    <div class="w-100 doujin-details">
                                        <div class="w-100 tags">
                                            Tags: ${$(tags_div).html()}
                                        </div>
                                        <span>Artist(s): <small class="badge badge-secondary mr-1">${'artist'}</small></span>
                                        
                                    </div>
                                    
                                </div>

                            </li>
                        `)
                    })
                    .catch((err) => { console.log(`${code} : ${err}`) })
            })
        }

    })

    // $('#aftermath-list ul').on('mouseenter', function () {
    //     $(this).toggleClass("border border-info")
    // }, function () {
    //     console.log('fuck off!')
    // })

    // $('#aftermath-list ul li').on({
    //     mouseenter: function () {
    //         $(this).addClass("border border-info");
    //     }, mouseleave: function () {
    //         $(this).removeClass("border border-info");
    //     }
    // });

})