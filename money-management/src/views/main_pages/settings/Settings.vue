<template>
  <div class="wrapper">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="page-title">Settings</h4>
          </div>
        </div>
      </div>
      <div class="card-box">
        <ul class="nav nav-tabs tabs-bordered">
          <li class="nav-item">
            <router-link :to="{name: 'settings'}" class="nav-link">
              Profile
            </router-link>
          </li>
        </ul>
        <div class="tab-content px-3">
          <h4 class="text-dark header-title my-3"><b>My Account</b></h4>
          <div class="form-horizontal">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Email</label>
              <div class="col-xl-6 col-lg-8">
                <input type="text" class="form-control" disabled :value="me.email">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Name</label>
              <div class="col-xl-3 col-md-4">
                <input type="text" class="form-control" placeholder="First Name" v-model="first_name">
              </div>
              <div class="m-1 d-md-none"></div>
              <div class="col-xl-3 col-md-5">
                <input type="text" class="form-control" placeholder="Last Name" v-model="last_name">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Password</label>
              <div class="col-xl-6 col-lg-8">
                <button class="btn btn-outline-secondary" data-toggle="modal" data-target="#change_password_modal">Change</button>
              </div>
              <!--begin::Modal-->
              <div id="change_password_modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
                <div class="modal-dialog h-100 d-flex flex-column justify-content-center my-0">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title text-center"><b>Change Password</b></h4>
                    </div>
                    <div class="modal-body">
                      <div class="row form-group">
                        <div class="col-12">
                          <label class="control-label">Current Password</label>
                          <input v-model="current_password" type="password" class="form-control">
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-md-12">
                          <label class="control-label">New Password</label>
                          <input v-model="new_password" type="password" class="form-control">
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-md-12">
                          <label class="control-label">New Password Repeat</label>
                          <input v-model="new_password2" type="password" class="form-control">
                        </div>
                      </div>
                      <div class="text-center">
                        <button class="btn btn-primary" @click="change_password()">Change</button>
                        <button class="btn btn-secondary ml-3" data-dismiss="modal">Cancel</button>
                        <p class="text-success m-0 mt-1">{{change_password_success_message}}</p>
                        <p class="text-danger m-0 mt-1">{{change_password_error_message}}</p>
                      </div>
                    </div>
                  </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
              </div>
              <!--end::Modal-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Settings",
  data() {
    return {
      current_password: "",
      new_password: "",
      new_password2: "",

      first_name: "",
      last_name: ""
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me"
    })
  },
  methods: {
    change_password() {
      if (this.new_password !== this.new_password2) {
        this.change_password_error_message = "New password doesn't match";
        return;
      }

      const form_data = {
        current_password: this.current_password,
        new_password: this.new_password
      };
      this.$store
        .dispatch("changePassword", form_data)
        .then(() => {
          let sec = 3;
          const self = this;
          setInterval(function() {
            self.change_password_success_message =
              "Password updated, please login use your new password in " +
              sec +
              " seconds";
            sec -= 1;
            if (sec === -1) {
              $("#change_password_modal").modal("hide");
              self.$store.dispatch("logout");
            }
          }, 1000);
        })
        .catch(() => {
          this.change_password_error_message = "Wrong current password";
        });
    },
    update_personal_detail() {
      if (this.verification_level >= 3) return;
      const form_data = {
        update: "name_birthday",
        birthday:
          this.birthday_year +
          "-" +
          this.birthday_month +
          "-" +
          this.birthday_day,
        first_name: this.first_name,
        last_name: this.last_name,
        nationality: this.nationality
      };
      this.$store
        .dispatch("updateMe", form_data)
        .then(() => {
          this.personal_detail_success_message = "Updated";
        })
        .catch(error => {
          this.personal_detail_error_message = error.data.error;
        });
    }
  },
  created() {
    this.first_name = this.me.first_name;
    this.last_name = this.me.last_name;
  }
};
</script>

<style scoped>
.tabs-bordered li a.router-link-exact-active {
  border-bottom: 2px solid #2b2e58 !important;
}

.stepwizard-step p {
  margin-top: 10px;
}

.stepwizard-row {
  display: table-row;
}

.stepwizard {
  display: table;
  width: 100%;
  position: relative;
}

.stepwizard-step button[disabled] {
  opacity: 1 !important;
  filter: alpha(opacity=100) !important;
}

.stepwizard-row:before {
  top: 14px;
  bottom: 0;
  position: absolute;
  content: " ";
  width: 100%;
  height: 1px;
  background-color: #ccc;
  z-order: 0;
}

.stepwizard-step {
  display: table-cell;
  text-align: center;
  position: relative;
}

.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px;
}
</style>
