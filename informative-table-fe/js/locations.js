let locations = [];
let screens = [];
$(document).ready(function(){
    axios({
        method: 'get',
        url: 'http://localhost:3000/api/locations'
    })
    .then( res => {
        locations = res.data;
        let html = ``;
        if(locations.length) {
            locations.forEach( (location, index) => {
                html+= `<tr id="tr-${index+1}">
                <td scope="row">${location.LocationName}</td>
                <td>${location.Details}</td>
                <td><a href="edit-screen.html?id=${location.ScreenId}"
                 data-toggle="tooltip" data-placement="top" title="Edit Screen">${location.ScreenName}</a></td>
                <td class="text-right">
                <button data-toggle="tooltip" data-placement="top" title="Copy URL" class="btn btn-sm btn-dark" onclick="copyLocationUrl('${location.LocationName}')"><i class="far fa-copy"></i></button>
                <button data-toggle="tooltip" data-placement="top" title="Edit" class="btn btn-sm btn-secondary" onclick="editLocation(${location.LocationId}, ${index+1})"><i class="far fa-edit"></i></button>
                <button data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-sm btn-danger" onclick="deleteLocation(${location.LocationId})"><i class="far fa-trash-alt"></i></button>
                </td>
            </tr>`;
            });
    
            document.getElementById('locations-content').innerHTML = html;
            $('[data-toggle="tooltip"]').on('mouseenter', function () {
                $(this).tooltip('show');
            });
            $('[data-toggle="tooltip"]').on('click', function () {
                $(this).tooltip('hide');
            });
        } else {
            html += `<tr class="text-center">
            <td colspan="4">
            <h5 class="mt-5">You don't have any locations yet.<br><br>Start creating location now by clicking on the "New Location" button.</h5>
            </td>
            </tr>`;
            document.getElementById('locations-content').innerHTML = html;
        }
    })
    .catch( err => {
        console.log(err);
        toastr.error(err.response.data.message);
    });

    axios({
        method: 'get',
        url: 'http://localhost:3000/api/screens'
    })
    .then( res => {
        screens = res.data;
        screens.forEach( screen => {
            let opt = document.createElement('option');
            opt.value = screen.ScreenId;
            opt.text = screen.ScreenName;
            document.getElementById('screen-select').appendChild(opt);
        });
    })
    .catch( err => {
        console.log(err);
        toastr.error(err.response.data.message);
    });
});

function createLocation(){
    let locationName = document.getElementById('location-name').value;
    let locationDetails = document.getElementById('location-details').value;
    let locationScreen = document.getElementById('screen-select').value;
    if(locationName && locationDetails) {
        const data = {
            LocationName: locationName,
            Details: locationDetails,
            ScreenId: locationScreen
        }
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/locations',
            data: data
        })
        .then( res => {
            location.reload();
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}

function editLocation(locationId, rowIndex) {
    const row = document.getElementById(`tr-${rowIndex}`);
    const location = locations.find( l => l.LocationId == locationId);
    let options = ``;
    screens.forEach(screen => {
        options += location.ScreenId === screen.ScreenId ? `<option value="${screen.ScreenId}" selected>${screen.ScreenName}</option>` : `<option value="${screen.ScreenId}">${screen.ScreenName}</option>`
    });
    row.innerHTML = `<td scope="row"><input id="edit-location-name" class="form-control" value="${location.LocationName}" required></td>
    <td><input id="edit-location-details" class="form-control" value="${location.Details}" required></td>
    <td><select class="form-control" value="${location.ScreenId}" id="edit-location-screen">${options}</select</td>
    <td class="text-right">
    <button type="submit" class="btn btn-sm btn-secondary" onclick="saveEditLocation(${location.LocationId})">Save</button>
    <button type="button" class="btn btn-sm btn-danger" onclick="cancelEditLocation(${location.LocationId}, ${rowIndex})">Cancel</button>
    </td>`;
}

function saveEditLocation(locationId){
    let locationName = document.getElementById('edit-location-name').value;
    let locationDetails = document.getElementById('edit-location-details').value;
    let locationScreen = document.getElementById('edit-location-screen').value;
    if(locationName && locationDetails) {
        const data = {
            LocationName: locationName,
            Details: locationDetails,
            ScreenId: locationScreen
        }
        axios({
            method: 'put',
            url: `http://localhost:3000/api/locations/${locationId}`,
            data: data
        })
        .then( res => {
            location.reload();
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}

function cancelEditLocation(locationId, rowIndex) {
    const row = document.getElementById(`tr-${rowIndex}`);
    const location = locations.find( l => l.LocationId == locationId);
    row.innerHTML = `<td scope="row">${location.LocationName}</td>
    <td>${location.Details}</td>
    <td><a href="edit-screen.html?id=${location.ScreenId}">${location.ScreenName}</a></td>
    <td class="text-right">
    <button data-toggle="tooltip" data-placement="top" title="Copy URL" class="btn btn-sm btn-dark" onclick="copyLocationUrl('${location.LocationName}')"><i class="far fa-copy"></i></button>
    <button data-toggle="tooltip" data-placement="top" title="Edit" class="btn btn-sm btn-secondary" onclick="editLocation(${location.LocationId}, ${rowIndex})"><i class="far fa-edit"></i></button>
    <button data-toggle="tooltip" data-placement="top" title="Delete" class="btn btn-sm btn-danger" onclick="deleteLocation(${location.LocationId})"><i class="far fa-trash-alt"></i></button>
    </td>`;
    $('[data-toggle="tooltip"]').on('mouseenter', function () {
        $(this).tooltip('show');
    });
    $('[data-toggle="tooltip"]').on('click', function () {
        $(this).tooltip('hide');
    });
}

function deleteLocation(locationId) {
    if(confirm('Are you sure you want to delete the location?')){
        axios({
            method: 'delete',
            url: `http://localhost:3000/api/locations/${locationId}`
        })
        .then( res => {
            location.reload();
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}

function copyLocationUrl(locationName) {
    const location = locations.find( l => l.LocationName === locationName);
    if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
      window['clipboardData'].clearData();
      window['clipboardData'].setData("Text", location.Url);
      toastr.success('Successfuly copied.');
    } else {
      document.addEventListener('copy', (e) => {
        e.clipboardData.setData('text/plain', (location.Url));
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
      toastr.success('Successfuly copied.');
    }
}

function closeModal() {
    document.getElementById('location-name').value = "";
    document.getElementById('location-details').value = "";
}