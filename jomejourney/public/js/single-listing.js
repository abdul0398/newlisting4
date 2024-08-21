(async ()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get("id");

    const data = await fetchSingleListing(id)
    const listing = data?.listing?.[0];
    console.log(listing);

    populateListing(listing);




})()



function populateListing(listing){
    // populating images
    const image_container = document.getElementById("media-thumbnails-gallery");

    image_container.innerHTML = ""
    const images = listing.images;
    const image_template = document.createElement('template');

    for (const image of images) {
        image_template.innerHTML += `
            <div data-src="https://api.jomejourney-portal.com${image}" title=""
              class="a-slide an-image swiper-slide" data-sub-html=".caption">
              <div class="media-wrap">
                <div class="thumb"><img class="lazyload"
                    src="https://api.jomejourney-portal.com${image}"
                    alt="${listing.name}" /></div>
                <span class="badge badge-top badge-light"></span>
                <div class="caption" style="display:none;">
                  <span></span>
                </div>
              </div>
            </div>
        `
    }

    image_container.appendChild(image_template.content);



    // populating name and description

    const list_item = document.querySelector(".link-item")
    const name = document.querySelector('#section-1 h1');
    const desc = document.querySelector('.first-para');
    list_item.innerText = listing.name;
    name.innerText = listing.name;
    desc.innerText = listing.description;


    // project details
    const container = document.querySelector("#section-2 .row");
    container.innerHTML = "";
    container.innerHTML = `
    <div class="col-md-4">
        <div class="text_info_item">
            <small>Street Address</small>
            <p>${listing?.details[0]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Postal District</small>
            <p>${listing?.details[1]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Geographic Region</small>
            <p>${listing?.details[2]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Market Segment</small>
            <p>${listing?.details[3]?.para}</p>
        </div>
        </div>
        <div class="col-md-4">
        <div class="text_info_item">
            <small>Project Category</small>
            <p>${listing?.details[4]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Development Size</small>
            <p>${listing?.details[5]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Launch Date</small>
            <p>${listing?.details[6]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>
            Expected TOP
            </small>
            <p>${listing?.details[7]?.para}</p>
        </div>
        </div>
        <div class="col-md-4">
        <div class="text_info_item">
            <small>Land Tenure</small>
            <p>${listing?.details[8]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Site Area</small>
            <p>${listing?.details[9]?.para}</p>
        </div>
        <div class="text_info_item">
            <small>Project Architect</small>
            <p>${listing?.details[10]?.para}</p>
        </div>
        <div class="text_info_item">
            <small> Joint Developers
            </small>
            <p>${listing?.details[11]?.para}</p>
        </div>
    </div>`

    // siteplans
    const site_plan_image = document.querySelector('#site-plan-gallery a');
    site_plan_image.setAttribute("href", `https://api.jomejourney-portal.com${listing?.siteplan?.images?.[0]}`) 

    const facilities_container = document.querySelector('#section-3 .swiper-wrapper')
    facilities_container.innerHTML = ""
    const facilities = listing?.siteplan?.facilities || [];

    for (let i = 0; i < facilities.length; i += 8) {
        const ul = document.createElement('ul');
        ul.classList.add('swiper-slide');
    
        facilities.slice(i, i + 8).forEach(facility => {
            const li = document.createElement('li');
            li.textContent = facility;
            ul.appendChild(li);
        });
        facilities_container.appendChild(ul);
    }


    // location map 
    const location_map_image = document.querySelector('#location-map-gallery a');
    location_map_image.setAttribute("href", `https://api.jomejourney-portal.com${listing?.location_map?.images?.[0]}`) 
    const location_map_tbody = document.querySelector('#section-4 tbody')
    const location_map = listing?.location_map?.amenities || [];
    location_map_tbody.innerHTML = "";

    let rowsHtml = '';

    location_map.forEach(item => {
        const locationText = item.Location

        rowsHtml += `
            <tr>
                <td>${item.Category}</td>
                <td>
                    ${locationText}
                </td>
                <td class="text-center">${item.Distance}</td>
            </tr>
        `;
    });

    location_map_tbody.innerHTML = rowsHtml;



     // unit_mix 
     
     const unit_mix_tbody = document.querySelector('#section-5 tbody')
     const unit_mix = listing?.unit_mix?.data || [];
     unit_mix_tbody.innerHTML = "";
 
     let rowsHtml_unit_mix = '';
 
     unit_mix.forEach(item => {
 
         rowsHtml_unit_mix += `
            <tr>
                <td>${item.unitType}</td>
                <td class="text-center">${item.totalUnits}</td>
                <td class="text-center">
                    ${item.size_sqft}
                </td>
                <td class="text-center">
                    ${item.unitMix}
                </td>
            </tr>
         `;
     });
 
     unit_mix_tbody.innerHTML = rowsHtml_unit_mix;


       // balance_unit 
       const balance_units_tbody = document.querySelector('#section-6 tbody')
       const balance_units = listing?.balance_units?.data || [];
       balance_units_tbody.innerHTML = "";
   
       let rowsHtml_balance_units = '';
   
       balance_units.forEach(item => {
   
           rowsHtml_balance_units += `
            <tr>
                <td>${item.unitType}</td>
                <td class="text-center">${item.availableUnits}</td>
                <td class="text-center">
                ${item.size_sqft}
                </td>
                <td class="text-center">
               ${item.psf}
                </td>
                <td class="text-center">
               ${item.price}
                </td>
            </tr>
           `;
       });
   
       balance_units_tbody.innerHTML = rowsHtml_balance_units;




       // developer info
       const dev_container = document.querySelector('#section-11 .dev-pro-content');
       const dev_img = dev_container.querySelector('img');
       dev_img.src = `https://api.jomejourney-portal.com${listing?.developer?.image}`
       const dev_desc = dev_container.querySelectorAll('p')[1]
       dev_desc.innerText = listing?.developer?.description || "";



}





async function fetchSingleListing(id){
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'cbvlagfusboas7d6f9234ksjdfhkj8979872k3b32b4jhgl987bn'
        },
        cors:'no-cors'
    
    }
    try {
        const res = await fetch(`https://api.jomejourney-portal.com/api/listing/single?id=${id}`, options);
        const data = await res.json();
        if(res.status == 200){
            return data;
        }
    } catch (error) {
        console.log("Error fetching new listings", error);
        return [];
    }
}