<template>
  <div class="wrapper">
    <div class="container-fluid">
      <!-- Page-Title -->
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="page-title">Predictions</h4>
          </div>
        </div>
      </div>
      <div class="row">

        <div v-for="cat in categories" class="col-sm-6">
          <div class="card-box">
            <canvas v-bind:id="cat"></canvas>
          </div>
        </div>

      </div>
    </div>
    <!-- end container -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Chart from 'chart.js'

export default {
  name: "Predictions",
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me",
      transactions: "transactions"
    })
  },
  methods: {
    createLineGraph(spend_data, pred_data, category){
      const ctx = document.getElementById(category);
      const myChart = new Chart(ctx, {
        title: category,
        type: 'line',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [
            {
              type: 'bubble',
              label: "Actual Spendings",
              backgroundColor: "#017DD7",
              data: spend_data,
              fill: false,
              showLines: false,
              pointRadius: 6,
            },
            {
              type: 'line',
              label: "Baseline Spendings",
              backgroundColor: "#FE0000",
              borderColor: "#FE0000",
              data: pred_data,
              fill: false,
              lineTension: 0,
              showLines: true,
              spanGaps: true,
              pointRadius: 0,
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                beginAtZero: true   // minimum value will be 0. 
              }
            }],
            xAxes: [{
              display: true,
            }]
          },
          title: {
            display: true,
            text: category,
            fontSize: 18,
          },
          legend: {
            display: true,
          }
        }
      });
    },
    getMonth(month) {
      switch(Number(month)) {
        case 1:
          return "January";
        case 2:
          return "February";
        case 3:
          return "March";
        case 4:
          return "April";
        case 5:
          return "May";
        case 6:
          return "June";
        case 7:
          return "July";
        case 8:
          return "August";
        case 9:
          return "September";
        case 10:
          return "October";
        case 11:
          return "November";
        case 12:
          return "December";
      }

    }
  },
  // Call these functions before the page loads (mounts)
  beforeMount(){
    let categories = []
    this.$store.dispatch("getUserCategories", this.me.user_id).then(result => {
      this.categories = result
      let params = {}
      params.user_id = this.me.user_id
      for(let category of this.categories) {
        params.category = category;
        this.$store.dispatch("getCategoryPredictions", params).then(result => {
          console.log(result)
          let months = result[0]
          let spendings = result[1]
          let predictions = result[2]
          let spend_data = []
          let pred_data = []
          // Get data into scatter plot format
          for (let i in months) {
            spend_data.push({x: this.getMonth(months[i]), y: spendings[i]});
            pred_data.push({x: this.getMonth(months[i]), y: predictions[i]});
          }
          this.createLineGraph(spend_data, pred_data, category);
        });
      }
    });
  },
  created() {

  },
  mounted() {

  },
};
</script>

<style scoped>
.card-box-no-outline {
  padding: 20px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #ffffff;
}
</style>
