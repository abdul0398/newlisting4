let listings;
let names = [];
(async () => {
    const data = await fetchListings();
    listings = data.listings;
    populateListings(listings)
    addFiltersEvent();
    populateFiltersValue()
    
})();





async function fetchListings(){
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'cbvlagfusboas7d6f9234ksjdfhkj8979872k3b32b4jhgl987bn'
        },
        cors:'no-cors'
    
    }
    try {
        const res = await fetch('https://api.jomejourney-portal.com/api/listings?page=all', options);
        const data = await res.json();
        if(res.status == 200){
            return data;
        }
    } catch (error) {
        console.log("Error fetching new listings", error);
        return [];
    }
}


function populateListings(listings){

    names = [];
    document.querySelector('.number-of-listings').innerText = listings.length

    const listings_container = document.querySelector(".card-listing");
    

    listings_container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (const listing of listings) {
        const address = listing?.details[0].para + ', ' + listing?.details[1].para ;
        const name = listing.name;
        const nearestMRT = listing?.location_map?.amenities?.find(detail => detail.Category == "MRT Stations") || null;
        const image_url = `https://api.jomejourney-portal.com${listing.images[0]? listing.images[0] : listing.images[1]}`
        const totalUnits = listing?.unit_mix?.data.find(unit => unit.unitType == "Overall")?.totalUnits || 0;
        const availableUnits = listing?.balance_units?.data.find(unit => unit.unitType == "Overall")?.availableUnits || 0;
        const unitsSold = totalUnits - availableUnits;
        const unit_mixes = listing.balance_units?.data;
        const developer = listing.developer
        names.push(name)

        const template = document.createElement('template');

        let unit_mix_html = '';

        const unit_mix_html_array = unit_mixes.map(item => {
            const psf = item.psf;
            const price = item.price;
            const unitType = item.unitType;
            const sqft = item.size_sqft;
        
            if (unitType === "Overall") {
                return "";
            }
            return `
                <div class="text-slide-wrapper disable-scrollbar" id="checkWidth" style="border-top: 1px solid #ccc; border-bottom:1px solid #ccc;">
                    <div class="text-slide-container swiper-container">
                        <div class="swiper-wrapper"> <!-- Missing opening '<' added -->
                            <div class="swiper-slide">
                                <div class="slide-item d-flex align-items-center">
                                    <div class="left-area">
                                        <span class="text-dark d-block d-xxl-inline-block d-xl-block d-md-inline-block mb-1 mb-xxl-0 mb-xl-1 mb-md-0 mr-4px">${unitType}</span>
                                        <span class="text-12 text-gray">${sqft} sqft</span>
                                    </div>
                                    <div class="ms-auto text-end text-xxl-start">
                                        <span class="text-dark d-xxl-none d-xl-block d-md-none d-block mb-1">${price}</span> <!--FOR SMALL DEVICE-->
                                        <span class="text-12 text-gray mr-4px mr-0fsm">${psf} PSF</span>
                                        <span class="text-dark d-xxl-inline-block d-xl-none d-md-inline-block d-none">${price}</span> <!--FOR LARGE DEVICE-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        unit_mix_html = unit_mix_html_array.join("");
        






        // populate listings
            const htmlString =  ` <div project-name='${name}' class="card-primary mb-4">
                    <!-- Card Header -->
                    <a href="project/?id=${listing.id}" target="_blank" class="detailhref">
                    <div class="card-header">
                        <div class="d-md-flex">
                        <!-- Thumbnail -->
                        <div class="thumbnail-wrapper flex-shrink-1">
                                                <div class="bottom-badge">
                            <span class="badge badge-dark-4 badge-img-count d-flex align-items-center">
                                <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.4002 0.799988C0.737454 0.799988 0.200195 1.33725 0.200195 1.99999V7.99999C0.200195 8.66273 0.737454 9.19999 1.4002 9.19999H8.60019C9.26294 9.19999 9.80019 8.66273 9.80019 7.99999V1.99999C9.80019 1.33725 9.26294 0.799988 8.60019 0.799988H1.4002ZM8.60019 7.99999H1.4002L3.80019 3.19999L5.60019 6.79999L6.80019 4.39999L8.60019 7.99999Z" fill="white"/>
                                </svg>
                                8
                            </span>
                            <span class="badge badge-dark-4 badge-img-count d-flex align-items-center">
                                <svg class="icon" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H8C8.53043 0 9.03914 0.210714 9.41421 0.585786C9.78929 0.960859 10 1.46957 10 2V10C10 10.5304 9.78929 11.0391 9.41421 11.4142C9.03914 11.7893 8.53043 12 8 12H2C1.46957 12 0.960859 11.7893 0.585786 11.4142C0.210714 11.0391 0 10.5304 0 10V2ZM12.553 3.106C12.3869 3.18899 12.2472 3.31658 12.1496 3.47447C12.0519 3.63237 12.0001 3.81434 12 4V8C12.0001 8.18566 12.0519 8.36763 12.1496 8.52553C12.2472 8.68342 12.3869 8.81101 12.553 8.894L14.553 9.894C14.7054 9.97017 14.8748 10.0061 15.045 9.99845C15.2152 9.99079 15.3806 9.93975 15.5256 9.85019C15.6706 9.76064 15.7902 9.63552 15.8733 9.48673C15.9563 9.33793 15.9999 9.17039 16 9V3C15.9999 2.82961 15.9563 2.66207 15.8733 2.51327C15.7902 2.36448 15.6706 2.23936 15.5256 2.14981C15.3806 2.06025 15.2152 2.00921 15.045 2.00155C14.8748 1.99388 14.7054 2.02983 14.553 2.106L12.553 3.106Z"
                                    fill="white"
                                />
                                </svg>
                                1
                            </span>
                                <span class="badge badge-dark-4 badge-img-count d-flex align-items-center">
                                <svg class="icon icon-rotate" width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.99996 0.833252C4.39996 0.833252 0.666626 2.69992 0.666626 4.99992C0.666626 6.86659 3.11663 8.44159 6.49996 8.97492V11.6666L9.83329 8.33325L6.49996 4.99992V7.27492C3.87496 6.80825 2.33329 5.69159 2.33329 4.99992C2.33329 4.11659 4.86663 2.49992 8.99996 2.49992C13.1333 2.49992 15.6666 4.11659 15.6666 4.99992C15.6666 5.60825 14.45 6.57492 12.3333 7.10825V8.81659C15.275 8.17492 17.3333 6.70825 17.3333 4.99992C17.3333 2.69992 13.6 0.833252 8.99996 0.833252V0.833252Z"
                                    fill="white"
                                />
                                </svg>
                                3
                            </span>
                                </div>
                                <div class="thumb d-none d-md-block" style="background-image: url(${image_url})"></div>
                                <div class="thumb d-md-none"
                                    style="background-image: url(${image_url})"></div>
                                </div>
                        <!-- Text Content -->
                        <div class="text-content">
                                                
                            <div class="title">
                            <div class="h2">${name}</div>
                            <p>in Flora Drive</p>
                            </div>
                            <ul class="inline-dot-list">
                            <li>Outside Central</li>
                            <li>
                                East Region
                            </li>
                            <li>${address}</li>
                            </ul>
                            <p class="mt-10 mb-9 text-gray">
                            ${nearestMRT.Distance} to
                            ${nearestMRT.Location}
                            </p>
                            <ul class="inline-line-list mb-12">
                            <li><span>Nov 2027</span></li>
                            <li><span>Freehold</span></li>
                            <li><span>Private Condominium</span></li>
                            </ul>
                            <ul class="badge-group-2 d-flex flex-wrap">
                            <li><span class="badge badge-light"><span>Total:</span> ${totalUnits} units</span></li>
                            <li><span class="badge badge-light"><span>Available:</span> ${availableUnits} units</span></li>
                            <li><span class="badge badge-light hide-xl-xxl"><span>Sold:</span> ${unitsSold} units</span></li>
                            </ul>
                        </div>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="card-body p-0">
                        ${unit_mix_html}
                    </div>

                    <!-- Card Footer -->
                    <div class="card-footer">
                        <div class="d-flex align-items-center">
                        <div class="com-avater-info d-flex align-items-center">
                            <div class="thumbnail">
                            <img class="lazyload" data-src="https://api.jomejourney-portal.com${developer.image}" alt="HLHL Symbol-1_iUg5" title="">
                            </div>
                            <div class="text-info">
                            <div class="name d-none d-md-block">Hong Leong Holdings Limited</div>
                            <div class="name d-md-none">Hong Leong Holdings Limited</div>
                            <p>With 2 Other Developers</p>
                            </div>
                        </div>
                        <div class="ms-auto right-area justify-content-end d-flex">
                            <div class="d-flex">
                            <div data-get-num="+65 8950-0058" class="btn btn-outline-primary mr-8 btn-min-w106 d-none d-md-inline-block nohref">Call Sales</div><!--BIGGER DEVICE-->
                            <div data-value="+6589500058" class="btn btn-outline-primary mr-8 d-md-none nohref href-tel">Call</div><!--SMALLER DEVICE-->
                            <div data-value="https://wa.link/pw2en8" class="btn btn-primary btn-icon d-flex align-items-center nohref href-wa">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0C3.582 0 0 3.582 0 8C0 9.50081 0.421561 10.9 1.14062 12.1003L0.0716146 16L4.05469 14.9544C5.21957 15.6167 6.56433 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM5.26172 4.26823C5.39172 4.26823 5.52529 4.26744 5.64063 4.27344C5.78329 4.27677 5.93857 4.28722 6.08724 4.61589C6.26391 5.00655 6.64858 5.9866 6.69792 6.08594C6.74725 6.18527 6.78221 6.30229 6.71354 6.43229C6.64821 6.56563 6.61423 6.64632 6.51823 6.76432C6.4189 6.87899 6.31005 7.02141 6.22005 7.10807C6.12072 7.20741 6.01815 7.31632 6.13281 7.51432C6.24748 7.71232 6.64571 8.36142 7.23437 8.88542C7.99104 9.56142 8.62946 9.76916 8.82812 9.86849C9.02679 9.96782 9.14184 9.95234 9.25651 9.81901C9.37451 9.68901 9.75208 9.24294 9.88542 9.04427C10.0154 8.8456 10.1481 8.87998 10.3281 8.94531C10.5108 9.01065 11.4849 9.49051 11.6836 9.58984C11.8823 9.68918 12.0125 9.73834 12.0625 9.81901C12.1138 9.90234 12.1139 10.2991 11.9492 10.7617C11.7846 11.2237 10.9759 11.6705 10.6133 11.7018C10.2473 11.7358 9.90571 11.8663 8.23438 11.2083C6.21838 10.4143 4.94699 8.34948 4.84766 8.21615C4.74832 8.08615 4.04036 7.1426 4.04036 6.16927C4.04036 5.1926 4.55244 4.71429 4.73177 4.51562C4.91444 4.31696 5.12839 4.26823 5.26172 4.26823Z" fill="white"/>
                                </svg>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </a>
                    </div>`

            template.innerHTML = htmlString

            fragment.appendChild(template.content);
        }
        listings_container.appendChild(fragment);
}








function addFiltersEvent() {
    
    // Add project name listener
    const search_project = document.getElementById("search-project-name");
    const project_name_container = document.getElementById('expanded-project-name');

    const handle_search_project = debounce(() => {
        const children = project_name_container.querySelectorAll('li');
        const filteredItems = Array.from(children).filter(item => 
            item.querySelector('label').innerText.toLowerCase().includes(search_project.value.toLowerCase())
        );

        children.forEach(child => {
            child.style.display = filteredItems.includes(child) ? '' : 'none';
        });

        

    }, 500);
    
    search_project.addEventListener("input", handle_search_project);
}


function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


function populateFiltersValue(){
    const project_name_filter = document.getElementById('expanded-project-name');
    project_name_filter.innerHTML = "";


    names.forEach(name=>{
        project_name_filter.innerHTML += ` <li class="list-item form-check">
        <input onclick="filterListings(this)" class="form-check-input " type="checkbox" id="project-check-box-${name}" data-text="${name}">
            <label class="form-check-label" for="project-check-box-${name}">
                ${name}
            </label>
        </li>`
    })
}



const filterListings = (input) => {
    if (input) {
        addFilterMarker(input);
    }

    const project_name_checkboxs = document.querySelectorAll("#expanded-project-name input");


    // project names filters
    const project_names_checked = [];
    project_name_checkboxs.forEach((input) => {
        const name = input.getAttribute('data-text');
        if (input.checked) {
            project_names_checked.push(name);
        }
    });


    // region filters
    const region_checkboxs = document.querySelectorAll('#expanded-project-segment input');

    const region_checked = [];
    region_checkboxs.forEach((input) => {
        const name = input.getAttribute('data-text');
        if (input.checked) {
            region_checked.push(name);
        }
    });


    // location filters
    const all_locations_inputs = document.querySelectorAll(".cb-district");

    const location_checked = [];
    all_locations_inputs.forEach((input) => {
        const name = input.getAttribute('data-text');
        if (input.checked) {
            location_checked.push(name);
        }
    });


    // mrt ditance filters
    const min_mrt_distance = document.getElementById('min-mrt-distance').value;
    const max_mrt_distance = document.getElementById('max-mrt-distance').value;


    // unit category
    const unit_inputs = document.querySelectorAll('#expanded-unit-category input');
    const units_category_checked = [];
    unit_inputs.forEach((input) => {
        const name = input.getAttribute('data-text');
        if (input.checked) {
            units_category_checked.push(name);
        }
    });

    // unit price 
    const min_unit_price = document.getElementById('min-unit-price').value.replace(/,/g, '');
    const max_unit_price = document.getElementById('max-unit-price').value.replace(/,/g, '');
    

    const filter_listings = listings.filter(listing => {
        if (project_names_checked.length == 0 && region_checked.length == 0 && location_checked.length == 0 && min_mrt_distance == "" && max_mrt_distance == "" && units_category_checked.lenght == 0 && min_unit_price == "" && max_unit_price == "") {
            return true;
        }

        const { region, location } = listing?.details?.reduce((acc, detail) => {
            if (detail.title === "Market Segment") {
                acc.region = detail;
            } else if (detail.title === "Postal District") {
                acc.location = detail;
            }
            return acc;
        }, { region: null, location: null });

        const mrt_distance = listing?.location_map?.amenities?.find(item=>{
            if(item.Category == "MRT Stations"){
                return true;
            }
        })?.Distance?.split('km')?.[0]

        const project_category = listing?.project_category;

        const price_data = listing?.balance_units?.data.find(item=>{
            if(item.unitType == "Overall"){
                return true;
            }
        })?.price

        const { lower_range,  upper_range }  = getLowerAndUpperPrice(price_data)


        const is_name_found = project_names_checked.length === 0 || project_names_checked.includes(listing.name);
        const is_region_found = region_checked.length === 0 || (region && region_checked.includes(region.para));
        const is_location_found = location_checked.length === 0 || (location && location_checked.includes(location.para));
        const is_min_dis_matched = min_mrt_distance == "" || mrt_distance * 1000 >= min_mrt_distance; 
        const is_max_dis_matched = max_mrt_distance == "" || mrt_distance * 1000 <= max_mrt_distance;
        const is_unit_category_matched = units_category_checked.length == 0 || units_category_checked.includes(project_category);
        const is_max_pric_matched = max_unit_price == "" || (upper_range <= max_unit_price);
        const is_min_pric_matched = min_unit_price == "" || (upper_range >= min_unit_price);


        return is_name_found && 
        is_region_found &&
        is_location_found && 
        is_max_dis_matched && 
        is_min_dis_matched && 
        is_unit_category_matched && 
        is_max_pric_matched && 
        is_min_pric_matched;
    });

    populateListings(filter_listings);
};




function addFilterMarker(input){
    const container = document.querySelector('.selected-filters-wrap');
    const id = input.getAttribute("id") 
    const name = input.getAttribute("data-text") ;

    if((input.type == "checkbox" && input.checked == false) || (input.type == 'text' && input.value == "")){
        const liElement = document.querySelector(`li[data-chip="${id}"]`);
        liElement?.remove();
        return;
    }
    
    if(input.type == 'text'){
        const if_already_present = document.querySelector(`li[data-chip="${id}"]`);
        if_already_present?.remove();
    }


    const template = document.createElement('template');

   template.innerHTML = `
    <li class="chip" data-chip="${id}">
        ${name}
        <button onclick="removeFilter(this)" class="btn-times filter-close-text">
        <i class="fas fa-times-circle"></i>
        </button>
    </li>`

    container.appendChild(template.content)
}




function removeFilter(btn){
    const parent = btn.parentElement;
    const id = parent.getAttribute("data-chip");

    const input = document.getElementById(id);
    if(input.type == 'checkbox'){
        input.checked = false;
    }else{
        input.value = "";
    }
    parent.remove();

    filterListings();
}


(()=>{

    // location event listener on outer checkbox
    const all_outer_locations_inputs = document.querySelectorAll('.cb-region');
    all_outer_locations_inputs.forEach(input=>{
        input.addEventListener("input", ()=>{
            const is_checked = input.checked;
            const ul = input.parentElement.nextElementSibling;
            const inputs = ul.querySelectorAll('input')
            inputs.forEach(inner_input=>{
                inner_input.checked = is_checked
                addFilterMarker(inner_input);
            })
            filterListings();
        })
    })


    // location event listener on inner checkbox
    const all_inner_locations_inputs = document.querySelectorAll(".cb-district");
    all_inner_locations_inputs.forEach(input=>{
        input.addEventListener("input", ()=>{
            filterListings(input);
        })
    })



    // initialise mrt distance listener
    const min_mrt_distance = document.getElementById('min-mrt-distance');
    const max_mrt_distance = document.getElementById('max-mrt-distance');

    function removeNonNumeric() {
        let phoneNumber = this.value.replace(/\D/g, '');
        phoneNumber = phoneNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.value = phoneNumber;
        filterListings(this);
    }
    
    min_mrt_distance.addEventListener('input',removeNonNumeric);
    max_mrt_distance.addEventListener('input',removeNonNumeric);



    // unit category listener 
    const unit_inputs = document.querySelectorAll('#expanded-unit-category input');
    unit_inputs.forEach(input=>{
        input.addEventListener("input", ()=>{
            filterListings(input);
        })
    })



    // unit price listener
    const min_unit_price = document.getElementById('min-unit-price');
    const max_unit_price = document.getElementById('max-unit-price');

    min_unit_price.addEventListener('input', removeNonNumeric, 500)
    max_unit_price.addEventListener('input', removeNonNumeric, 500)


})()



function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


function getLowerAndUpperPrice(price) {
    let [lower_range, upper_range] = price.split('-');

    const convertToInteger = (priceStr) => {
        priceStr = priceStr.trim().replace(/[$,]/g, ''); 
        if (priceStr.includes('M')) {
            return parseFloat(priceStr.replace('M', '')) * 1_000_000; 
        }
        return parseInt(priceStr); 
    };

    lower_range = ~~ convertToInteger(lower_range);
    upper_range = upper_range ? ~~convertToInteger(upper_range) : ~~lower_range;

    return {
        lower_range,
        upper_range
    };
}




