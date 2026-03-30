package vacation.stayawhile.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vacation.stayawhile.app.model.VacationProperty;
import vacation.stayawhile.app.repository.VacationPropertyRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class VacationPropertyService {
    
    @Autowired
    private VacationPropertyRepository vacationPropertyRepository;
    
    public VacationProperty saveProperty(VacationProperty property) {
        VacationProperty saved = vacationPropertyRepository.save(property);
        System.out.println("Saved property with ID: " + saved.get_id());
        System.out.println("Title: " + saved.getTitle());
        System.out.println("Total properties stored: " + vacationPropertyRepository.count());
        return saved;
    }
    
    public List<VacationProperty> getAllProperties() {
        return vacationPropertyRepository.findAll();
    }
    
    public VacationProperty getPropertyById(String id) {
        return vacationPropertyRepository.findById(id).orElse(null);
    }
    
    public void deleteProperty(String id) {
        vacationPropertyRepository.deleteById(id);
    }
    
    public List<VacationProperty> getPropertiesByState(String state) {
        return vacationPropertyRepository.findAll().stream()
                .filter(property -> property.getAddress() != null && 
                                   state.equals(property.getAddress().getState()))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public List<VacationProperty> getPropertiesByCity(String city) {
        return vacationPropertyRepository.findAll().stream()
                .filter(property -> property.getAddress() != null && 
                                   city.equalsIgnoreCase(property.getAddress().getCity()))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public List<VacationProperty> getPropertiesByTag(String tag) {
        return vacationPropertyRepository.findAll().stream()
                .filter(property -> property.getTags() != null && 
                                   property.getTags().stream().anyMatch(t -> tag.equalsIgnoreCase(t)))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public List<VacationProperty> getPropertiesByIndexRange(int startIndex, int endIndex) {
        List<VacationProperty> allProperties = vacationPropertyRepository.findAll();
        
        // Validate indices
        if (startIndex < 0) startIndex = 0;
        if (endIndex >= allProperties.size()) endIndex = allProperties.size() - 1;
        if (startIndex > endIndex) return new ArrayList<>();
        
        return allProperties.subList(startIndex, endIndex + 1);
    }
}
