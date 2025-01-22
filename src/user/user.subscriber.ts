import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
  } from 'typeorm';
  import { Injectable, OnModuleInit } from '@nestjs/common';
  import { ModuleRef } from '@nestjs/core';
  import { User } from './entities/user.entity';
  
  @EventSubscriber()
  @Injectable()
  export class UserSubscriber
    implements EntitySubscriberInterface<User>, OnModuleInit
  {
    constructor(private moduleRef: ModuleRef) {}
  
    listenTo() {
      return User;
    }
  
    async onModuleInit() {}
  
    async beforeInsert(event: InsertEvent<User>) {
      const user = event.entity;
      if (!user.password) return;
      user.password = await user.hashPassword(user.password);
    }
  }
  