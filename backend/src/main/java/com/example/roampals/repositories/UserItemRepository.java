package com.example.roampals.repositories;

import com.example.roampals.entities.User;
import com.example.roampals.entities.UserCreature;
import com.example.roampals.entities.UserItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserItemRepository extends JpaRepository<UserItem, Integer> {
    @Query("SELECT COUNT(DISTINCT ui.item.itemId) FROM UserItem ui WHERE ui.user = :user")
    long countDistinctItemByUser(User user);
    List<UserItem> findByUser(User user);

}
