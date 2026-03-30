// Index Render - Load first 8 properties from API
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch properties in two ranges: 1-4 and 5-8
        const [firstRangeResponse, secondRangeResponse] = await Promise.all([
            fetch('http://localhost/api/properties/range?start=1&end=4'),
            fetch('http://localhost/api/properties/range?start=5&end=8')
        ]);
        
        if (!firstRangeResponse.ok || !secondRangeResponse.ok) {
            throw new Error('Failed to load properties from API');
        }
        
        const firstRange = await firstRangeResponse.json();
        const secondRange = await secondRangeResponse.json();
        
        // Combine both ranges
        let properties = [
            ...(Array.isArray(firstRange) ? firstRange : [firstRange]),
            ...(Array.isArray(secondRange) ? secondRange : [secondRange])
        ];
        
        console.log('Properties loaded from API:', properties);
        console.log('Total properties found:', properties.length);
        
        // Update property cards with dynamic data
        const propertyCards = document.querySelectorAll('li[class*="w-full lg:w-1/4"]');
        
        properties.forEach((property, index) => {
            if (propertyCards[index]) {
                const card = propertyCards[index];
                
                // Find the text elements in this card
                const titleElement = card.querySelector('.pointer-events-none.mt-2.block');
                const locationElement = card.querySelector('.pointer-events-none.block:not(.mt-2)');
                
                // Extract property info
                const title = property.nickname || property.title ||  'Property';
                const location =  `${property.address?.city}, ${property.address?.state}` || 'Location';
                
                // Update text content
                if (titleElement) {
                    titleElement.textContent = title;
                    console.log(`Updated card ${index + 1} title:`, title);
                }
                
                if (locationElement) {
                    locationElement.textContent = location;
                    console.log(`Updated card ${index + 1} location:`, location);
                }
                
                // Update link href if property has _id
                const linkElement = card.querySelector('a[href*="/destinations/"]');
                if (linkElement && property._id) {
                    linkElement.href = `/destinations/villa.html?id=${property._id}`;
                }
                
                // Update image if property has pictures
                const imgElements = card.querySelectorAll('img');
                if (imgElements.length > 0 && property.pictures && property.pictures.length > 0) {
                    const imageUrl = property.pictures[0].original || property.pictures[0].thumbnail;
                    if (imageUrl) {
                        imgElements.forEach(img => {
                            img.src = imageUrl;
                            img.alt = title;
                            img.srcset = ''; // Clear srcset for simplicity
                        });
                        console.log(`Updated card ${index + 1} image:`, imageUrl);
                    }
                }
                
                // Update image alt attributes
                imgElements.forEach(img => {
                    img.alt = title;
                });
            }
        });
        
        console.log('Successfully updated property cards with data from API');
        
    } catch (error) {
        console.error('Error loading properties:', error);
    }
});
