$(document).ready(function() {

    // Remove validation message if there is no poster present
    $('#term').focus(function() {
        var full = $('#poster').has('img').length ? true : false;
        if (full == false)
            $('#poster').empty();
    });

    var getPoster = function() {

        // Get the movie title store it in variable
        var film = $('#term').val();

        // Check for user input
        if (film == '') {

            // IF the input field is empty, display the message
            $('#poster').html('<h2 class="loading">You need to type something for this thing to work!</h2>');
        } else {

            // The user entered a title, proceed
            $('#poster').html('<h2 class="loading">Going to get your poster!</h2>');
        }

        var json = null;

        // TMDB API call requesting data for specified movie
        $.getJSON('http://api.themoviedb.org/3/search/movie?api_key=8aab37801c425440d8c5dc2c2ab49318&query=' + film + '&callback=?', function(json) {

            // TMDB responds with number of total results, we use it for validation
            if (json.total_results > 1) {

                console.log(json.results.length);
                // Display poster and results message
                $('#poster').hide().html('<h2 class="loading">Turns out there are ' + json.results.length + ' possible matches!</h2>' +
                                    '<a id="originalPoster" href="https://image.tmdb.org/t/p/original/' + json.results[0].poster_path +'">' +
                                    '<img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '" />' +
                                    '</a>').fadeIn('slow');

                $('#buttons').hide().html('<a href="#" id="prev" class="arrow" onclick="return false;">previous</a>' +
                                    '<a href="#" id="next" class="arrow" onclick="return false;">next</a>' +
                                    '<p id="counter"><span id="countVal">1</span> / ' + json.results.length + '</p>').fadeIn('slow');

                loadNextPoster(json);
            } else if (json.total_results == 1) {

                // Display poster and results message
                $('#poster').html('<h2 class="loading">Well, it looks like we found your poster!</h2><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '" />');
            } else {

                // If nothing was found, return error message and poster
                $.getJSON('http://api.themoviedb.org/3/search/movie?api_key=8aab37801c425440d8c5dc2c2ab49318&query=the%20goonies&callback=?', function(json) {

                    $('#poster').html('<h2 class="loading">Nothing was found!.  Try searching again!  Are The Goonies are good enough?</h2><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '" />');
                });
            }
        });

        return false;
    }

    var loadNextPoster = function(data) {

        var length = data.results.length;
        var i = 0;

        $(document).on('click', '#buttons a#prev', function() {

            if (i == 0) {
                i = (length - 1);
            } else {
                i--;
            }

            $('#originalPoster').attr('href', 'https://image.tmdb.org/t/p/original/' + data.results[i].poster_path);
            $('#thePoster').attr('src', 'http://image.tmdb.org/t/p/w500/' + data.results[i].poster_path);
            $('#buttons span').html(i+1).fadeIn('slow');
        });

        $(document).on('click', '#buttons a#next', function() {

            if (i == (length - 1)) {
                i = 0;
            } else {
                i++;
            }

            $('#originalPoster').attr('href', 'https://image.tmdb.org/t/p/original/' + data.results[i].poster_path);
            $('#thePoster').attr('src', 'http://image.tmdb.org/t/p/w500/' + data.results[i].poster_path);
            $('#buttons span').html(i+1).fadeIn('slow');
        });
    }

    // If the search button is clicked, get the poster
    $('#search').click(getPoster);

    // If the user presses enter, get the poster
    $('#term').keyup(function(event) {

        if (event.keyCode == 13) {
            getPoster();
        }
    });
});