function solve() {

	const getId = (function* getId() {
		let id = 1;
		while (true) {
			yield id++;
		}
	}());

	const Validator = {
		isString(str, propName) {
			if (typeof str !== 'string') {
				throw Error(`${propName} must be a string!`);
			}
		},

		isNumber(num, propName) {
			if (typeof num !== 'number' || num === NaN) {
				throw Error(`${propName} must be a number!`);
			}
		},

		isStringLengthBetween3and25(str, propName) {
			if (str.length < 3 || str.length > 25) {
				throw Error(`${propName} must be between 3 and 25 symbols long!`);
			}
		},

		isNumberBetween(num, min, max, propName) {
			if (num < min || num > max) {
				throw Error(`${propName} must be a number between ${min} and ${max}!`);
			}
		}
	}

	function listObjects(arr, page, size, sortByProp, thenByProp) {
		if (page < 0 || size <= 0 || page * size >= arr.length) {
			throw Error('Invalid parameters!');
		}

		return arr
			.slice()
			.sort((a, b) => {
				if (a[sortByProp] !== b[sortByProp]) {
					return a[sortByProp] - b[sortByProp];
				} else {
					return a[thenByProp] - b[thenByProp];
				}
			})
			.slice(page * size, (page * size) + size);
	}

	class Player {
		constructor(name) {
			this.name = name;
			this._playlists = [];
		}

		get name() {
			return this._name;
		}
		set name(value) {
			this._name = value;
		}

		addPlaylist(playlistToAdd) {
			if (!(playlistToAdd instanceof Playlist)) {
				throw Error('Cannot add this type of playlist!');
			}

			this._playlists.push(playlistToAdd);
			return this;
		}

		getPlaylistById(id) {
			const found = this._playlists.find(p => p.id === id);
			return found === undefined ? null : found;
		}

		removePlaylist(value) {
			let playlistToRemoveIndex;

			switch (typeof value) {
				case 'number': // value is id
					playlistToRemoveIndex = this._playlists.findIndex(p => p.id === value);

					if (playlistToRemoveIndex < 0) {
						throw Error('There is no playlist with this id!');
					}

					this._playlists.splice(playlistToRemoveIndex, 1);

					return this;

				case 'object': // value is playlist
				case 'Playlist':
					if (value.id === undefined) {
						throw Error('Value is not a playlist');
					}

					playlistToRemoveIndex = this._playlists.findIndex(p => p.id === value.id);
					this._playlists.splice(playlistToRemoveIndex, 1);

					return this;

				default:
					return this;
			}

		}

		listPlaylists(page, size) {
			return listObjects(this._playlists, page, size, 'name', 'id');
		}

		contains(playable, playlist) {
			//const pl = this._playlists.find(p => p.id === playlist.id);

			return playlist.getPlayableById(playable.id) === null ? false : true;
		}

		search(pattern) {
			//const rgx = /pattern/g;

			return this._playlists
				.slice()
				.forEach(plist => plist
					.forEach(playable => playable
						.filter(song => song.title.contains(pattern))// rgx.test(song.title))
						.map(song => {
							return {
								title: song.title,
								id: song.id
							}
						})
					)
				)

		}
	}

	class Playable {
		constructor(title, author) {
			this._id = getId.next().value;
			this.title = title;
			this.author = author;
		}

		get id() {
			return this._id;
		}

		get title() {
			return this._title;
		}
		set title(value) {
			Validator.isString(value, 'Title');
			Validator.isStringLengthBetween3and25(value, 'Title');

			this._title = value
		}

		get author() {
			return this._author;
		}
		set author(value) {
			Validator.isString(value, 'Author');
			Validator.isStringLengthBetween3and25(value, 'Author');

			this._author = value;
		}

		play() {
			return `[${this.id}]. [${this.title}] - [${this.author}]`;
		}
	}

	class Audio extends Playable {
		constructor(title, author, length) {
			super(title, author);
			this.length = length;
		}

		get length() {
			return this._length;
		}
		set length(value) {
			if (value < 1) {
				throw Error('Length must be greater than 0');
			}

			this._length = value;
		}

		play() {
			let rds = super.play();
			return rds + ` - [${this.length}]`;
		}
	}

	class Video extends Playable {
		constructor(title, author, imdbRating) {
			super(title, author);
			this.imdbRating = imdbRating;
		}

		get imdbRating() {
			return this._imdbRating;
		}
		set imdbRating(value) {
			Validator.isNumber(value, 'IMDB rating');
			Validator.isNumberBetween(value, 1, 5, 'IMDB rating');

			this._imdbRating = value;
		}

		play() {
			const rds = super.play();
			return rds + ` - [${this.imdbRating}]`;
		}
	}

	class Playlist {
		constructor(name) {
			this._id = getId.next().value;
			this.name = name;
			this._playablesList = [];
		}

		get id() {
			return this._id;
		}

		get name() {
			return this._name;
		}
		set name(value) {
			Validator.isString(value, 'Name');
			Validator.isStringLengthBetween3and25(value, 'Name');

			this._name = value;
		}

		addPlayable(playable) {
			this._playablesList.push(playable);
			return this;
		}

		getPlayableById(id) {
			const found = this._playablesList.find(p => p.id === id);
			return found === undefined ? null : found;
		}

		removePlayable(value) {
			let playableToRemoveIndex;

			switch (typeof value) {
				case 'number': // value is id
					playableToRemoveIndex = this._playablesList.findIndex(p => p.id === value);

					if (playableToRemoveIndex < 0) {
						throw Error('There is no playable with this id!');
					}

					this._playablesList.splice(playableToRemoveIndex, 1);

					return this;

				case 'object': // value is playable
				case 'Playable':
					if (value.id === undefined) {
						throw Error('Value is not a playable');
					}

					playableToRemoveIndex = this._playablesList.findIndex(p => p.id === value.id);
					this._playablesList.splice(playableToRemoveIndex, 1);

					return this;

				default:
					return this;
			}
		}

		listPlayables(page, size) {
			return listObjects(this._playablesList, page, size, 'title', 'id');
		}
	}

	class Module {
		getPlayer(name) {
			return new Player(name);
		}

		getPlaylist(name) {
			return new Playlist(name);
		}

		getAudio(title, author, length) {
			return new Audio(title, author, length);
		}

		getVideo(title, author, imdbRating) {
			return new Video(title, author, imdbRating);
		}
	};

	return new Module;
}

module.exports = solve;