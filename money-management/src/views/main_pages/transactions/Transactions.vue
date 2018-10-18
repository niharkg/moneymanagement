<template>
  <div class="wrapper" v-if="transactions">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="page-title">My Transactions</h4>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card-box">
            <h4 class="text-dark header-title m-b-30">Filters</h4>
              <div class="row">
                  <div class="col-12">
                      <form class="form-horizontal" role="form">
                          <div class="form-group row">
                              <label class="col-2 col-form-label">Category</label>
                              <div class="col-4">
                                  <select class="form-control">
                                      <option>1</option>
                                      <option>2</option>
                                      <option>3</option>
                                      <option>4</option>
                                      <option>5</option>
                                  </select>
                              </div>
                              <label class="col-2 col-form-label">Payment Method</label>
                              <div class="col-4">
                                  <select class="form-control">
                                      <option></option>
                                      <option>Card Swiped	</option>
                                      <option>Online</option>
                                      <option>Apple Pay</option>
                                      <option>Chip</option>
                                  </select>
                              </div>
                          </div>
                      </form>
                  </div>
                <router-link class="btn btn-primary">
                  Search
                </router-link>
              </div>
              <!-- end row -->
          </div> <!-- end card-box -->
        </div>
        <div class="col-lg-12">
          <div class="card-box">
            <h4 class="text-dark header-title m-b-30">Transactions</h4>
            <table class="table">
              <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Vendor</th>
                <th>Location</th>
              </tr>
              </thead>
              <tbody>
              <!-- User Transactions Concise Table -->
              <tr v-for="(tx, index) in transactions">
                <td>{{tx.sale_date.slice(0, 10)}}</td>
                <td>{{tx.sale_date.slice(11, 16)}}</td>
                <td>${{tx.amount.toFixed(2)}}</td>
                <td>{{tx.category}}</td>
                <td>{{tx.payment_method}}</td>
                <td>{{tx.location.vendor_name}}</td>
                <td>{{tx.location.city}}, {{tx.location.state}}</td>
              </tr>
              </tbody>
            </table>
            <nav>
              <ul class="pagination pagination-split justify-content-center">
                  <li class="page-item">
                      <router-link class="page-link" :to="{name:'transactions', query:{page:1}}" aria-label="Previous">
                          <span aria-hidden="true">«</span>
                          <span class="sr-only">Previous</span>
                      </router-link>
                  </li>
                  <li class="page-item"><router-link class="page-link" v-show="page-3 > 0" :to="{name:'transactions', query:{page:page-3}}">{{page-3}}</router-link></li>
                  <li class="page-item"><router-link class="page-link" v-show="page-2 > 0" :to="{name:'transactions', query:{page:page-2}}">{{page-2}}</router-link></li>
                  <li class="page-item"><router-link class="page-link" v-show="page-1 > 0" :to="{name:'transactions', query:{page:page-1}}">{{page-1}}</router-link></li>
                  <li class="page-item active"><router-link class="page-link" :to="{name:'transactions', query:{page:1}}">{{page}}</router-link></li>
                  <li class="page-item"><router-link class="page-link" :to="{name:'transactions', query:{page:parseInt(page)+1}}">{{parseInt(page)+1}}</router-link></li>
                  <li class="page-item"><router-link class="page-link" :to="{name:'transactions', query:{page:parseInt(page)+2}}">{{parseInt(page)+2}}</router-link></li>
                  <li class="page-item"><router-link class="page-link" :to="{name:'transactions', query:{page:parseInt(page)+3}}">{{parseInt(page)+3}}</router-link></li>
                  <li class="page-item">
                      <router-link class="page-link" :to="{name:'transactions', query:{page:-1}}" aria-label="Next">
                          <span aria-hidden="true">»</span>
                          <span class="sr-only">Next</span>
                      </router-link>
                  </li>
              </ul>
            </nav>
            <div v-if="!transactions.length" class="text-center">
              <p>You have no transactions.</p>
              <button class="btn btn-primary">
                Explore
              </button>
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
  name: "Transactions",

  data() {
    return {
      transactions: [],
      page: 1
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me"
    })
  },
  methods: {
    formatTime(time) {
      return moment(time).fromNow();
    },
    getTransactoinsByPage() {
      this.$store
        .dispatch("getTransactoinsByPage", this.$route.query)
        .then(result => {
          this.transactions = result;
        });
    }
  },
  beforeMount() {
    var d = new Date();
    // TODO: Fix month (User data not in October yet)
    if (this.$route.query.page) {
      this.page = this.$route.query.page;
      this.getTransactoinsByPage(this.$route.query);
    } else this.getTransactoinsByPage(this.$route.query);
  },
  watch: {
    "$route.query.page": function() {
      if (this.$route.query.page) {
        this.page = this.$route.query.page;
        this.getTransactoinsByPage(this.$route.query);
      } else this.getTransactoinsByPage(this.$route.query);
    }
  }
};
</script>

<style scoped>
.m-widget5 .m-widget5__item {
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
