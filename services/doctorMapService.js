import axios from 'axios'
import { Loader } from '@googlemaps/js-api-loader'

/**
 * Service for finding nearby lung doctors and specialists
 */

// API key would typically be stored in environment variables
// For demo purposes, we're using a placeholder
const GOOGLE_MAPS_API_KEY = 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU'

/**
 * Load Google Maps API
 * @returns {Promise<google.maps>} - Promise that resolves with the Google Maps API
 */
export const loadGoogleMapsApi = () => {
  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places', 'geometry']
  })
  
  return loader.load()
}

/**
 * Initialize a map in the specified element
 * @param {HTMLElement} mapElement - The element to render the map in
 * @param {Object} location - The location to center the map on
 * @param {Array} markers - Array of marker locations to display on the map
 * @returns {Promise<Object>} - Promise that resolves with the map and markers
 */
export const initializeMap = async (mapElement, location, markers = []) => {
  try {
    const google = await loadGoogleMapsApi()
    const { Map, Marker, LatLngBounds, SymbolPath } = google.maps
    
    // Create the map
    const map = new Map(mapElement, {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 12,
      styles: [
        {
          "featureType": "poi.medical",
          "elementType": "geometry",
          "stylers": [
            { "color": "#c5e8ff" }
          ]
        },
        {
          "featureType": "poi.medical",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#4285F4" }
          ]
        }
      ]
    })
    
    // Add user location marker
    const userMarker = new Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: map,
      title: 'Your Location',
      icon: {
        path: SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    })
    
    // Add doctor markers
    const doctorMarkers = markers.map((marker, index) => {
      return new Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        map: map,
        title: marker.name || `Location ${index + 1}`,
        label: {
          text: String.fromCharCode(65 + index),
          color: '#ffffff'
        },
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      })
    })
    
    // Fit bounds to include all markers
    if (markers.length > 0) {
      const bounds = new LatLngBounds()
      bounds.extend({ lat: location.latitude, lng: location.longitude })
      
      markers.forEach(marker => {
        bounds.extend({ lat: marker.latitude, lng: marker.longitude })
      })
      
      map.fitBounds(bounds)
    }
    
    return { map, userMarker, doctorMarkers }
  } catch (error) {
    console.error('Error initializing map:', error)
    throw error
  }
}

/**
 * Find nearby lung doctors based on location
 * @param {Object} location - The location to search near (with latitude and longitude)
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array>} - Promise that resolves with an array of doctors
 */
export const findNearbyLungDoctors = async (location, radius = 5000) => {
  try {
    const google = await loadGoogleMapsApi()
    
    // For demo purposes, we'll return mock data
    // In a production app, you would make an actual API call to Google Places API
    
    // Example API call (commented out):
    // Using the Places service directly with the loaded Google Maps API
    // const placesService = new google.maps.places.PlacesService(document.createElement('div'))
    // const request = {
    //   location: new google.maps.LatLng(location.latitude, location.longitude),
    //   radius: radius,
    //   type: ['doctor'],
    //   keyword: 'pulmonologist lung specialist'
    // }
    // 
    // return new Promise((resolve, reject) => {
    //   placesService.nearbySearch(request, (results, status) => {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //       resolve(results.map(place => ({
    //         id: place.place_id,
    //         name: place.name,
    //         location: {
    //           latitude: place.geometry.location.lat(),
    //           longitude: place.geometry.location.lng()
    //         },
    //         address: place.vicinity,
    //         rating: place.rating || 0
    //       })))
    //     } else {
    //       reject(new Error(`Places API error: ${status}`))
    //     }
    //   })
    // })
    
    // Return mock data
    return getMockDoctors(location)
  } catch (error) {
    console.error('Error finding nearby lung doctors:', error)
    throw error
  }
}

/**
 * Get details for a specific doctor
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} - Promise that resolves with doctor details
 */
export const getDoctorDetails = async (doctorId) => {
  try {
    const google = await loadGoogleMapsApi()
    
    // For demo purposes, we'll return mock data
    // In a production app, you would make an actual API call to Google Places API
    
    // Example API call (commented out):
    // const placesService = new google.maps.places.PlacesService(document.createElement('div'))
    // const request = {
    //   placeId: doctorId,
    //   fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'reviews', 'website', 'geometry']
    // }
    // 
    // return new Promise((resolve, reject) => {
    //   placesService.getDetails(request, (place, status) => {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //       resolve({
    //         id: place.place_id,
    //         name: place.name,
    //         address: place.formatted_address,
    //         phone: place.formatted_phone_number,
    //         website: place.website,
    //         rating: place.rating || 0,
    //         reviews: place.reviews || [],
    //         location: {
    //           latitude: place.geometry.location.lat(),
    //           longitude: place.geometry.location.lng()
    //         }
    //       })
    //     } else {
    //       reject(new Error(`Places API error: ${status}`))
    //     }
    //   })
    // })
    
    // Return mock data
    return getMockDoctorDetails(doctorId)
  } catch (error) {
    console.error('Error getting doctor details:', error)
    throw error
  }
}

/**
 * Get user's current location
 * @returns {Promise<Object>} - Promise that resolves with the user's location
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to a default location if geolocation is not available
      console.warn('Geolocation is not supported by your browser, using default location')
      resolve({
        latitude: 37.7749,
        longitude: -122.4194 // San Francisco coordinates as fallback
      })
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.error('Error getting user location:', error)
        // Fallback to a default location if there's an error
        resolve({
          latitude: 37.7749,
          longitude: -122.4194 // San Francisco coordinates as fallback
        })
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  })
}

/**
 * Generate directions to a doctor's location
 * @param {Object} origin - Starting location coordinates (with latitude and longitude)
 * @param {Object} destination - Doctor's location coordinates (with latitude and longitude)
 * @returns {Promise<Object>} - Promise that resolves with directions data
 */
export const getDirections = async (origin, destination) => {
  try {
    const google = await loadGoogleMapsApi()
    
    // For demo purposes, we'll return mock data
    // In a production app, you would make an actual API call to Google Directions API
    
    // Example API call (commented out):
    // const directionsService = new google.maps.DirectionsService()
    // const request = {
    //   origin: new google.maps.LatLng(origin.latitude, origin.longitude),
    //   destination: new google.maps.LatLng(destination.latitude, destination.longitude),
    //   travelMode: google.maps.TravelMode.DRIVING
    // }
    // 
    // return new Promise((resolve, reject) => {
    //   directionsService.route(request, (result, status) => {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //       resolve({
    //         distance: result.routes[0].legs[0].distance.text,
    //         duration: result.routes[0].legs[0].duration.text,
    //         steps: result.routes[0].legs[0].steps.map(step => step.instructions)
    //       })
    //     } else {
    //       reject(new Error(`Directions API error: ${status}`))
    //     }
    //   })
    // })
    
    // Return mock data
    return {
      distance: '3.2 miles',
      duration: '12 minutes',
      steps: [
        'Head north on Main St',
        'Turn right onto Oak Ave',
        'Turn left onto Medical Center Dr',
        'Destination will be on your right'
      ]
    }
  } catch (error) {
    console.error('Error getting directions:', error)
    throw error
  }
}

/**
 * Generate a static map image URL
 * @param {Object} location - The location to center the map on (with latitude and longitude)
 * @param {Array} markers - Array of marker locations to display on the map (each with latitude and longitude)
 * @param {number} zoom - Map zoom level (1-20)
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {string} - URL for the static map image
 */
export const getStaticMapUrl = (location, markers = [], zoom = 14, width = 600, height = 300) => {
  // Base URL
  let url = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=${zoom}&size=${width}x${height}&key=${GOOGLE_MAPS_API_KEY}&scale=2`
  
  // Add markers
  markers.forEach((marker, index) => {
    url += `&markers=color:red|label:${String.fromCharCode(65 + index)}|${marker.latitude},${marker.longitude}`
  })
  
  // Add user location marker
  url += `&markers=color:blue|${location.latitude},${location.longitude}`
  
  return url
}

// Helper function to generate mock data for nearby doctors
const getMockDoctors = (location) => {
  // Generate some random offsets for the mock locations
  const doctors = [
    {
      id: 'doctor-1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Pulmonologist',
      rating: 4.8,
      location: {
        latitude: location.latitude + 0.01,
        longitude: location.longitude - 0.005
      },
      address: '123 Medical Center Dr, Suite 101',
      distance: '1.2 miles',
      phone: '(555) 123-4567',
      availability: 'Next available: Tomorrow at 10:00 AM'
    },
    {
      id: 'doctor-2',
      name: 'Dr. Michael Chen',
      specialty: 'Thoracic Surgeon',
      rating: 4.9,
      location: {
        latitude: location.latitude - 0.008,
        longitude: location.longitude + 0.012
      },
      address: '456 Health Parkway, Building B',
      distance: '2.5 miles',
      phone: '(555) 987-6543',
      availability: 'Next available: Thursday at 2:30 PM'
    },
    {
      id: 'doctor-3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Respiratory Specialist',
      rating: 4.7,
      location: {
        latitude: location.latitude + 0.015,
        longitude: location.longitude + 0.008
      },
      address: '789 Wellness Blvd, Suite 205',
      distance: '3.1 miles',
      phone: '(555) 456-7890',
      availability: 'Next available: Monday at 9:15 AM'
    },
    {
      id: 'doctor-4',
      name: 'Dr. James Wilson',
      specialty: 'Pulmonary Rehabilitation',
      rating: 4.6,
      location: {
        latitude: location.latitude - 0.012,
        longitude: location.longitude - 0.01
      },
      address: '321 Care Street, Medical Tower 3',
      distance: '3.8 miles',
      phone: '(555) 234-5678',
      availability: 'Next available: Friday at 11:45 AM'
    },
    {
      id: 'doctor-5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Interventional Pulmonologist',
      rating: 4.9,
      location: {
        latitude: location.latitude + 0.02,
        longitude: location.longitude - 0.018
      },
      address: '555 Physician Lane, Suite 300',
      distance: '4.2 miles',
      phone: '(555) 876-5432',
      availability: 'Next available: Wednesday at 3:00 PM'
    }
  ]
  
  return doctors
}

// Helper function to get mock details for a specific doctor
const getMockDoctorDetails = (doctorId) => {
  const doctors = {
    'doctor-1': {
      id: 'doctor-1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Pulmonologist',
      bio: 'Dr. Johnson is a board-certified pulmonologist with over 15 years of experience treating respiratory conditions. She specializes in asthma, COPD, and interstitial lung disease.',
      education: [
        'MD, Harvard Medical School',
        'Residency in Internal Medicine, Massachusetts General Hospital',
        'Fellowship in Pulmonary Medicine, Johns Hopkins Hospital'
      ],
      rating: 4.8,
      reviews: [
        { author: 'John D.', rating: 5, text: 'Dr. Johnson is incredibly knowledgeable and took the time to explain my condition thoroughly.' },
        { author: 'Maria S.', rating: 5, text: 'Excellent doctor who really listens to her patients. Highly recommend!' },
        { author: 'Robert T.', rating: 4, text: 'Very professional and caring. The wait time was a bit long but worth it.' }
      ],
      address: '123 Medical Center Dr, Suite 101',
      phone: '(555) 123-4567',
      website: 'https://www.drjohnsonpulmonary.com',
      hours: {
        Monday: '8:00 AM - 5:00 PM',
        Tuesday: '8:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 6:00 PM',
        Thursday: '8:00 AM - 5:00 PM',
        Friday: '8:00 AM - 4:00 PM',
        Saturday: 'Closed',
        Sunday: 'Closed'
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Aetna',
        'Cigna',
        'Medicare',
        'United Healthcare'
      ],
      location: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    'doctor-2': {
      id: 'doctor-2',
      name: 'Dr. Michael Chen',
      specialty: 'Thoracic Surgeon',
      bio: 'Dr. Chen is a renowned thoracic surgeon specializing in minimally invasive procedures for lung conditions. He has pioneered several innovative surgical techniques.',
      education: [
        'MD, Stanford University School of Medicine',
        'Residency in General Surgery, UCSF Medical Center',
        'Fellowship in Thoracic Surgery, Mayo Clinic'
      ],
      rating: 4.9,
      reviews: [
        { author: 'Patricia L.', rating: 5, text: 'Dr. Chen is an exceptional surgeon. His expertise gave me confidence during a difficult time.' },
        { author: 'David W.', rating: 5, text: 'The care I received from Dr. Chen and his team was outstanding. Highly recommended.' },
        { author: 'Susan M.', rating: 4, text: 'Very thorough and professional. Explains everything clearly.' }
      ],
      address: '456 Health Parkway, Building B',
      phone: '(555) 987-6543',
      website: 'https://www.drchenthoracic.com',
      hours: {
        Monday: '7:30 AM - 4:30 PM',
        Tuesday: '7:30 AM - 4:30 PM',
        Wednesday: '7:30 AM - 4:30 PM',
        Thursday: '7:30 AM - 4:30 PM',
        Friday: '7:30 AM - 3:00 PM',
        Saturday: 'Closed',
        Sunday: 'Closed'
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Aetna',
        'Cigna',
        'Medicare',
        'Kaiser Permanente'
      ],
      location: {
        latitude: 37.7833,
        longitude: -122.4167
      }
    },
    'doctor-3': {
      id: 'doctor-3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Respiratory Specialist',
      bio: 'Dr. Rodriguez specializes in the diagnosis and treatment of complex respiratory disorders. She has a particular interest in sleep-related breathing disorders and pulmonary rehabilitation.',
      education: [
        'MD, University of Pennsylvania',
        'Residency in Internal Medicine, NYU Langone',
        'Fellowship in Pulmonary Medicine, Cleveland Clinic'
      ],
      rating: 4.7,
      reviews: [
        { author: 'Thomas H.', rating: 5, text: 'Dr. Rodriguez helped me manage my severe asthma when other doctors couldn\'t. She\'s amazing!' },
        { author: 'Jennifer K.', rating: 4, text: 'Very knowledgeable and patient. Takes time to answer all questions.' },
        { author: 'Michael P.', rating: 5, text: 'Excellent care and follow-up. My breathing has improved significantly under her care.' }
      ],
      address: '789 Wellness Blvd, Suite 205',
      phone: '(555) 456-7890',
      website: 'https://www.drrodriguezrespiratory.com',
      hours: {
        Monday: '9:00 AM - 6:00 PM',
        Tuesday: '9:00 AM - 6:00 PM',
        Wednesday: '10:00 AM - 7:00 PM',
        Thursday: '9:00 AM - 6:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '9:00 AM - 1:00 PM',
        Sunday: 'Closed'
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'United Healthcare',
        'Cigna',
        'Medicare',
        'Medicaid'
      ],
      location: {
        latitude: 37.7694,
        longitude: -122.4862
      }
    },
    // Add more doctor details as needed
  }
  
  // Return the requested doctor or a default if not found
  return doctors[doctorId] || {
    id: doctorId,
    name: 'Doctor Information',
    specialty: 'Specialist',
    bio: 'Information not available',
    rating: 4.0,
    address: 'Address not available',
    phone: 'Phone not available'
  }
}
