<template>
  <transition name="modal" >
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <p>Are you sure?</p>
              <button class="modal-default-button" @click="$emit('accept')">
                Yes
              </button>
              <button class="modal-default-button" @click="$emit('decline')">
                No
              </button>
            </slot>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
  @import '../assets/styles/modal.css';
</style>