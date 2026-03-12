package org.example.userservice.mapper;

import org.example.userservice.dto.UserDTO;
import org.example.userservice.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null)
            return null;
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public User toEntity(UserDTO dto) {
        if (dto == null)
            return null;
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                // Password should be handled specifically during registration/update, not
                // typically via basic mapper
                .build();
    }
}
