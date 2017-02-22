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

	class Player {
		constructor(name) {
			this.name = name;
		}

		get name() {
			return this._name;
		}
		set name(value) {
			this._name = value;
		}

		addPlaylist(playlistToAdd) {
			// TODO
		}

		getPlaylistById(id) {
			// TODO
		}

		removePlaylist(id) {
			// TODO
		}

		removePlaylist(playlist) {
			// TODO
		}

		listPlaylists(page, size) {
			// TODO
		}

		contains(playable, playlist) {
			// TODO
		}

		search(pattern) {
			// TODO
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

				default: return this;
			}
		}

		listPlayables(page, size) {
			if (page < 0 || size <= 0 || page * size >= this._playablesList.length) {
				throw Error('Invalid parameters!');
			}

			return this._playablesList
				.slice()
				.sort((a, b) => {
					if (a.title !== b.title) {
						return a.title - b.title;
					} else {
						return a.id - b.id;
					}
				})
				.slice(page * size, (page * size) + size);
		}
	}

	class Module {
		getPlayer(name) {
			// returns a new player instance with the provided name
			return new Player(name);
		}

		getPlaylist(name) {
			//returns a new playlist instance with the provided name
			return new Playlist(name);
		}

		getAudio(title, author, length) {
			//returns a new audio instance with the provided title, author and length
			return new Audio(title, author, length);
		}

		getVideo(title, author, imdbRating) {
			//returns a new video instance with the provided title, author and imdbRating
			return new Video(title, author, imdbRating);
		}
	};

	return new Module;
}

module.exports = solve;