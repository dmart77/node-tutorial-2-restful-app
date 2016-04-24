var UserListModel = function() {
    
    var self = this;
    self.users = ko.observableArray([]);
    self.current = ko.observable();
    self.newUser = ko.mapping.fromJS({username:null, email:null, fullname:null, age:null, location:null, gender:null});
    
    self.isNewUserValid = function() {
        return (self.newUser.username() &&
                self.newUser.fullname());
    };
    
    self.showUserInfo = function(user) {
        self.current(user);
    };    
    
    self.loadUsers = function() {
        
        $.getJSON('/users/userlist', function( data ) {
            self.users(data);
            
            if (self.users().length > 0)
                self.current(self.users()[0]);            
        });
        
    };
    
    self.deleteUser = function(user) {
        
        var confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation === true) {

            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + user._id
            }).done(function(response) {

                // Check for a successful (blank) response
                if (response.msg === '') {
                    
                    if (user === self.current())
                        self.current(undefined);
                        
                    self.users.remove(user);                    
                }
                else {
                    alert('Error: ' + response.msg);
                }

            });
        }
    };
    
    self.addUser = function() {

        $.ajax({
            type: 'POST',
            data: ko.mapping.toJS(self.newUser),
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {
                self.loadUsers();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });        
    };    
    
};

// DOM Ready =============================================================

$(document).ready(function() {
    
    var userListModel = new UserListModel();
    userListModel.loadUsers();    
    ko.applyBindings(userListModel);
    
});
