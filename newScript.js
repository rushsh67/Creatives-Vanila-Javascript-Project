(async function () {
	const { colors } = await fetch(
		'http://random-flat-colors.vercel.app/api/random?count=6'
	).then((res) => res.json());

	const leftColors = document.querySelector('.left-colors');
	const rightColors = document.querySelector('.right-colors');
	const leftSection = document.querySelector('.left-section');
	const searchBar = document.querySelector('.searchBar');
	const progressBar = document.querySelector('.progress-bar');
	const progress = document.querySelector('.progress');
	const addCreation = document.querySelector('.add-creation');
	const resultDiv = document.querySelector('.resultDiv');

	const modal = document.querySelector('.modal');
	const closeModal = document.querySelector('.close');
	const modalForm = document.querySelector('.add-form');
	const done = document.querySelector('.add-form');
	const doneBtn = document.querySelector('.done');

	// if(localStorage.getItem('creativesCount')==null){
	//     localStorage.setItem('creativesCount',0)
	// }

	let count = 0;
	const colorDivs = [];

	document.addEventListener('keydown', (e) => {
		if (e.code == 'Escape' && !modal.classList.contains('hidden')) {
			closeModal.click();
		}
	});

	modalForm.addEventListener('keyup', () => {
		const data = new FormData(modalForm);
		let [title, subtitle, color] = data.values();

		if (title && subtitle && color) {
			doneBtn.disabled = false;
		} else {
			doneBtn.disabled = true;
		}
	});
	modalForm.addEventListener('click', () => {
		const data = new FormData(modalForm);
		let [title, subtitle, color] = data.values();

		if (title && subtitle && color) {
			doneBtn.disabled = false;
		} else {
			doneBtn.disabled = true;
		}
	});

	colors.forEach((color) => {
		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.style.appearance = 'none';
		checkbox.value = color;
		checkbox.style.background = color;

		let radioButton = document.createElement('input');
		radioButton.type = 'radio';
		radioButton.name = 'color';
		radioButton.value = color;
		radioButton.required = true;
		radioButton.style.appearance = 'none';
		radioButton.style.background = color;

		leftColors.appendChild(checkbox);
		rightColors.appendChild(radioButton);
	});

	function changeProgress(count) {
		// localStorage.setItem('creativesCount',count);
		progress.innerHTML = `${count}/5`;
		progressBar.style.width = `${20 * count}%`;
	}

	done.addEventListener('submit', (e) => {
		e.preventDefault();
		if (count == 5) {
			alert('No more creations');
			return;
		}
		const formData = new FormData(modalForm);
		const [title, subtitle, color] = formData.values();
		// console.log(title,subtitle,color);
		colorDivs.push({ title, subtitle, color });
		createDiv(title, subtitle, color);
		changeProgress(++count);
		modalForm.reset();
		closeModal.click();
	});

	function createDiv(title, subtitle, color) {
		let newDiv = document.createElement('div');
		// let button = document.createElement('button');
		// button.className = 'delete btn';
		// button.innerText = 'X';
		// button.addEventListener('click', (e) => {
		// 	e.target.parentNode.remove();
		// 	changeProgress(--count);
		// });
		newDiv.className = 'colorDiv';
		newDiv.value = color;
		newDiv.style.background = color;
		let h1 = document.createElement('h1');
		h1.innerText = title;
		let h4 = document.createElement('h4');
		h4.innerText = subtitle;
		newDiv.appendChild(h1);
		// newDiv.appendChild(button);
		newDiv.appendChild(h4);
		resultDiv.appendChild(newDiv);
	}

	addCreation.addEventListener('click', () => {
		if (count == 5) {
			alert('No more creations');
			return;
		}
		modal.classList.toggle('hidden');
		leftSection.classList.toggle('border');
		leftSection.classList.toggle('set-width');
		addCreation.disabled = true;
	});

	closeModal.addEventListener('click', () => {
		modal.classList.toggle('hidden');
		leftSection.classList.toggle('border');
		leftSection.classList.toggle('set-width');
		addCreation.disabled = false;
	});

	//Filtering logic
	let filterColor = [];
	let slug = '';
	leftColors.addEventListener('click', (e) => {
		if (e.target.type == 'checkbox') {
			if (e.target.checked) {
				filterColor.push(e.target.value);
				// console.log(filterColor);
				filterResults()
			} else {
				filterColor = filterColor.filter((c) => {
					return c != e.target.value;
				});
				filterResults()
				// console.log(filterColor);
			}
		}
	});

	//Event listener to process user input in search bar
	searchBar.addEventListener('input', (e) => {
		slug = e.target.value.toLowerCase();
		filterResults()
	});

	function filterResults() {
		if(filterColor.length === 0 && slug===''){
			//If no filter is selected then show all creations
			if(colorDivs.length === 0) return;
			// console.log(colorDivs);
			resultDiv.innerHTML = '';
			colorDivs.map((div) => createDiv(div.title,div.subtitle,div.color))
		}else{
			resultDiv.innerHTML = ''
			let temp = [...colorDivs];
			//filter by search
			temp = temp.filter(t => {
				let title = t.title.toLowerCase()
				let subtitle = t.subtitle.toLowerCase()
				return (title.includes(slug) || subtitle.includes(slug))
			})
			//filter by color if selected
			temp = temp.filter(t=>{
				if(filterColor.length ===0) return temp
				return filterColor.includes(t.color);
			})
			//showing filtered creations
			temp.map((div) => createDiv(div.title,div.subtitle,div.color))
		}
	}
})();
